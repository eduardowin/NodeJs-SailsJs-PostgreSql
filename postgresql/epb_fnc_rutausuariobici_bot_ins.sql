-- FUNCTION: public.epb_fnc_rutausuariobici_bot_ins(character varying)

-- DROP FUNCTION public.epb_fnc_rutausuariobici_bot_ins(character varying);

CREATE OR REPLACE FUNCTION public.epb_fnc_rutausuariobici_bot_ins(
	pdatacabecerajson character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$

DECLARE vBicicletaId BIGINT; 
DECLARE vUsuarioId CHARACTER VARYING; 
DECLARE vPickPointId_Origen BIGINT;
DECLARE vPickPointId_Destino BIGINT; 

DECLARE vRutaUsuarioBicicletaId BIGINT=0; 
DECLARE vResultado CHARACTER VARYING(500); 
DECLARE vFilasAfectadas INTEGER; 
DECLARE vRutaUsuarioBicicletaIdRuta BIGINT;
DECLARE vDataJson JSON;
BEGIN

    BEGIN 
        SELECT 	'0|OK'
                INTO
                vResultado;

        SELECT 	
                cast(jColumn->> 'bicicletaid_seleccionado' AS BIGINT),
                cast(jColumn->> 'UsuarioId' AS CHARACTER VARYING),
                cast(jColumn->> 'pp_destino' AS BIGINT),
                cast(jColumn->> 'pp_origen' AS BIGINT)

                INTO
                vBicicletaId,
                vUsuarioId,
                vPickPointId_Destino,
                vPickPointId_Origen        

        FROM 	(SELECT cast(pDataCabeceraJson AS json) as  jColumn ) as jTable;
        
         ---------------------------------------------------

            SELECT 	epb_fnc_ruta_enviaje_sel(' { "vEscenario": "1" , "UsuarioId": "'|| vUsuarioId||'"  , "email": ""  }')
                    INTO
                    vDataJson
            ;

            SELECT 	jColumn->> 'vRutaUsuarioBicicletaId' 
                    INTO
                    vRutaUsuarioBicicletaIdRuta 
            FROM 	(SELECT vDataJson as  jColumn ) as jTable;

			raise notice '%', vDataJson;
            IF(vRutaUsuarioBicicletaIdRuta > 0) THEN
            	vRutaUsuarioBicicletaId = -1;
                SELECT 	'-5|{{first name}} ya estás en viaje, no te olvides avisarnos al llegar a tu destino presionando el boton !YA LLEGUE!|'|| vRutaUsuarioBicicletaIdRuta
                        INTO
                        vResultado;
            END IF;

         IF(vRutaUsuarioBicicletaIdRuta = -1 ) THEN
         
         ---------------------------------------------------
                WITH resultadoAfectados AS (
                    -------------------
                    INSERT INTO public."ePB_RutaUsuarioBicicleta"
                    (
                        "BicicletaId",
                        "UsuarioId",
                        "PickPointId_Origen",
                        "PickPointId_Destino",
                        "Hora_Inicio",
                        "Fec_Registro",
                        "Est_RutaUsuarioBicicleta",
                        "Est_Registro"
                    )
                    VALUES
                    (
                        vBicicletaId,
                        vUsuarioId,
                        vPickPointId_Origen,
                        vPickPointId_Destino,
                        to_char(current_timestamp AT TIME ZONE 'UTC 5', 'YYYY-MM-DD HH:MI:SS'),
                        to_char(current_timestamp AT TIME ZONE 'UTC 5', 'YYYY-MM-DD HH:MI:SS'),
                        2,
                        1
                    )
                    -------------------
                    RETURNING "BicicletaId"
                ) 
                SELECT 	COUNT(*)
                        INTO 
                        vFilasAfectadas	
                FROM 	resultadoAfectados ;

               IF NOT (vFilasAfectadas >= 1) THEN

                    SELECT 	'-1|Surgió una incidencia por favor vuelve a repetir la acción anterior'
                            INTO
                            vResultado;
                END IF;
        ---------------------------------------------------
                WITH resultadoAfectados AS (
                    -------------------
                    UPDATE 	public."epb_bicicletapikpoint"
                    SET		"est_bicicleta" = 2 
                    WHERE	"pickpointid" =  vPickPointId_Origen
                            AND "bicicletaid" = vBicicletaId
                            AND "est_bicicleta" = 0
                    -------------------
                    RETURNING "pickpointid"
                ) 
                SELECT 	COUNT(*)
                        INTO 
                        vFilasAfectadas	
                FROM 	resultadoAfectados ;

               IF NOT (vFilasAfectadas >= 1) THEN

                    SELECT 	'-2|{{first name}} ya estás en viaje, no te olvides avisarnos al llegar a tu destino presionando el boton !YA LLEGUE!'
                            INTO
                            vResultado;
                END IF;
        ---------------------------------------------------        
                WITH resultadoAfectados AS (
                    -------------------
                    UPDATE 	public."ePB_PickPoint"
                    SET		"Cnt_Bici_Disponible" = "Cnt_Bici_Disponible" -1
                    WHERE 	"PickPointId" = vPickPointId_Origen
                    -------------------
                    RETURNING "PickPointId"
                ) 
                SELECT 	COUNT(*)
                        INTO 
                        vFilasAfectadas	
                FROM 	resultadoAfectados ;

               IF NOT (vFilasAfectadas >= 1) THEN

                    SELECT 	'-3|{{first name}} ya estás en viaje, no te olvides avisarnos al llegar a tu destino presionando el boton !YA LLEGUE!'
                            INTO
                            vResultado;
                END IF;
        ---------------------------------------------------  
                WITH resultadoAfectados AS (
                    -------------------
                    UPDATE 	public."ePB_PickPoint"
                    SET		"cnt_bici_llegada" = "cnt_bici_llegada" + 1
                    WHERE 	"PickPointId" = vPickPointId_Destino
                    -------------------
                    RETURNING "PickPointId"
                ) 
                SELECT 	COUNT(*)
                        INTO 
                        vFilasAfectadas	
                FROM 	resultadoAfectados ;

               IF NOT (vFilasAfectadas >= 1) THEN

                    SELECT 	'-4|{{first name}} ya estás en viaje, no te olvides avisarnos al llegar a tu destino presionando el boton !YA LLEGUE!'
                            INTO
                            vResultado;
                END IF;
        ---------------------------------------------------  

                SELECT 	cast(last_value AS BIGINT) 
                        INTO
                        vRutaUsuarioBicicletaId
                FROM 	epb_rutausuariobicicleta_rutausuariobicicletaid_seq;

                if( split_part(vResultado, '|', 2)  = 'OK') THEN
                    vRutaUsuarioBicicletaId = vRutaUsuarioBicicletaId;
                ELSE 
                    ROLLBACK; 
                END IF;
          END IF;

    EXCEPTION WHEN OTHERS THEN
        raise notice '% %', SQLERRM, SQLSTATE;
        vRutaUsuarioBicicletaId = -1;
        -- do nothing
    END;
   
 
 RETURN  cast('[{"vRutaUsuarioBicicletaId": '|| cast(vRutaUsuarioBicicletaId AS CHARACTER VARYING) || ',"MsgResultado": "' || vResultado||'"}]' AS json);
  
END;

$BODY$;

ALTER FUNCTION public.epb_fnc_rutausuariobici_bot_ins(character varying)
    OWNER TO pikbik;
