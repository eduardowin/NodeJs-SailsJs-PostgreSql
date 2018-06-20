-- FUNCTION: public.epb_fnc_rutausuariobici_llegada_bot_ins(character varying)

-- DROP FUNCTION public.epb_fnc_rutausuariobici_llegada_bot_ins(character varying);

CREATE OR REPLACE FUNCTION public.epb_fnc_rutausuariobici_llegada_bot_ins(
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

DECLARE vRutaUsuarioBicicletaId BIGINT; 
DECLARE vbicipikpointid BIGINT; 
DECLARE vflg_ruta_incompleta INTEGER; 

DECLARE vResultado CHARACTER VARYING(500); 
DECLARE vFilasAfectadas INTEGER; 
 
DECLARE vExisteRegistro INTEGER = 0;

BEGIN

    BEGIN 
        SELECT 	'0|OK'
                INTO
                vResultado;
        SELECT 	
                cast(jColumn->> 'bicicletaid_seleccionado' AS BIGINT),
                cast(jColumn->> 'UsuarioId' AS CHARACTER VARYING),
                cast(jColumn->> 'pp_destino' AS BIGINT),
                cast(jColumn->> 'pp_origen' AS BIGINT),
                cast(jColumn->> 'RutaUsuarioBicicletaId' AS BIGINT),
                cast(jColumn->> 'flg_ruta_incompleta' AS INTEGER)
                INTO
                vBicicletaId,
                vUsuarioId,
                vPickPointId_Destino,
                vPickPointId_Origen,
                vRutaUsuarioBicicletaId,
                vflg_ruta_incompleta

        FROM 	(SELECT cast(pDataCabeceraJson AS json) as  jColumn ) as jTable;
---------------------------------------------------
		SELECT  COUNT(1)
        		INTO
                vExisteRegistro
        FROM 	public."epb_bicicletapikpoint" D
        WHERE 	D."bicicletaid" 		= vBicicletaId 
        		AND D."est_bicicleta" 	= 0
                AND D."est_registro" 	= 1 
                AND to_char(D."fec_registro" , 'YYYY/MM/DD')  	= to_char(current_timestamp AT TIME ZONE 'UTC 5', 'YYYY/MM/DD');                     
        
---------------------------------------------------
		IF(vExisteRegistro >= 1) THEN

            SELECT 	'-5|.'
                    INTO
                    vResultado;
                
        ELSE
				WITH resultadoAfectados AS (
                    -------------------
                    UPDATE 	public."ePB_RutaUsuarioBicicleta"
                    SET		"Est_RutaUsuarioBicicleta" 	= 3,
                            "Fec_Actualizacion" 		= to_char(current_timestamp AT TIME ZONE 'UTC 5', 'YYYY-MM-DD HH:MI:SS'),
                            "Hora_Fin"					= to_char(current_timestamp AT TIME ZONE 'UTC 5', 'YYYY-MM-DD HH:MI:SS'),
                    		"flg_ruta_incompleta"		= vflg_ruta_incompleta
                    WHERE	"RutaUsuarioBicicletaId" 	= vRutaUsuarioBicicletaId
                    -------------------
                    RETURNING "RutaUsuarioBicicletaId"
                ) 
                SELECT 	COUNT(*)
                        INTO 
                        vFilasAfectadas	
                FROM 	resultadoAfectados ;

               IF NOT (vFilasAfectadas >= 1) THEN

                    SELECT 	'-1|{{first name}} surgio una incidencia, comunicate con nosotros por whatsap'
                            INTO
                            vResultado;
                END IF;
---------------------------------------------------
---------------------------------------------------
        	    WITH resultadoAfectados AS (
                    -------------------
                    UPDATE 	public."epb_bicicletapikpoint"
                    SET		"est_bicicleta" 			= 3,
                            "fec_actualizacion" 		= current_timestamp AT TIME ZONE 'UTC 5'
                    WHERE	"pickpointid" 				=  vPickPointId_Origen
                            AND "bicicletaid" 			= vBicicletaId
                            AND "est_bicicleta" in (1,2)
                    -------------------
                    RETURNING "pickpointid"
                ) 
                SELECT 	COUNT(*)
                        INTO 
                        vFilasAfectadas	
                FROM 	resultadoAfectados ;

               IF NOT (vFilasAfectadas >= 1) THEN

                    SELECT 	'-2|{{first name}} surgio una incidencia, comunicate con nosotros por whatsap'
                            INTO
                            vResultado;
                END IF;
---------------------------------------------------
---------------------------------------------------
        	    WITH resultadoAfectados AS (
                    -------------------
                    UPDATE 	public."ePB_PickPoint"
                    SET		"cnt_bici_llegada" 			= "cnt_bici_llegada" - 1, -- Xq ya llego al PikPoint
                            "Cnt_Bici_Disponible" 		= "Cnt_Bici_Disponible" + 1 
                    WHERE 	"PickPointId" 				= vPickPointId_Destino
                    -------------------
                    RETURNING "PickPointId"
                ) 
                SELECT 	COUNT(*)
                        INTO 
                        vFilasAfectadas	
                FROM 	resultadoAfectados ;

               IF NOT (vFilasAfectadas >= 1) THEN

                    SELECT 	'-3|{{first name}} surgio una incidencia, comunicate con nosotros por whatsap'
                            INTO
                            vResultado;
                END IF;
                
---------------------------------------------------
---------------------------------------------------
        	    WITH resultadoAfectados AS (
                    -------------------
                    INSERT INTO epb_bicicletapikpoint
                    (
                        "pickpointid",
                        "bicicletaid",
                        "est_bicicleta",
                        "est_registro",
                        "fec_registro"
                    )
                    VALUES
                    (
                        vPickPointId_Destino,
                        vBicicletaId,
                        0,
                        1,
                        current_timestamp AT TIME ZONE 'UTC 5'
                    )
                    -------------------
                    RETURNING "pickpointid"
                ) 
                SELECT 	COUNT(*)
                        INTO 
                        vFilasAfectadas	
                FROM 	resultadoAfectados ;
---------------------------------------------------
---------------------------------------------------

               IF NOT (vFilasAfectadas >= 1) THEN

                    SELECT 	'-4|{{first name}} surgio una incidencia, comunicate con nosotros por whatsap'
                            INTO
                            vResultado;
                END IF;
---------------------------------------------------

                if( split_part(vResultado, '|', 2)  = 'OK') THEN
                     SELECT 	'0|OK'
                        		INTO
                        		vResultado;
                ELSE 
                    ROLLBACK; 
                END IF;
         END IF;

    EXCEPTION WHEN OTHERS THEN
        raise notice '% %', SQLERRM, SQLSTATE;
        vbicipikpointid = -1;
        -- do nothing
    END;
 
RETURN  cast('[{"MsgResultado": "'|| cast(vResultado AS CHARACTER VARYING) || '"}]' AS json);
 
END

$BODY$;

ALTER FUNCTION public.epb_fnc_rutausuariobici_llegada_bot_ins(character varying)
    OWNER TO pikbik;
