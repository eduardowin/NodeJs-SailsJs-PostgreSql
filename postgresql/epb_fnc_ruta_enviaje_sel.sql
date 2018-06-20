-- FUNCTION: public.epb_fnc_ruta_enviaje_sel(character varying)

-- DROP FUNCTION public.epb_fnc_ruta_enviaje_sel(character varying);

CREATE OR REPLACE FUNCTION public.epb_fnc_ruta_enviaje_sel(
	pdatacabecerajson character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$

DECLARE vUsuarioId VARCHAR(80);
DECLARE vEmail VARCHAR(120); 
DECLARE vEscenario Integer=0; 
DECLARE vRutaUsuarioBicicletaId Bigint =0; 

BEGIN

SELECT 	jColumn->> 'email',
		jColumn->> 'UsuarioId',
        jColumn->> 'vEscenario'
    	INTO
    	vEmail,
        vUsuarioId,
        vEscenario
FROM 	(SELECT cast(pDataCabeceraJson AS json) as  jColumn ) as jTable;

IF(vEscenario = 1) THEN

        SELECT
                R."RutaUsuarioBicicletaId"  
                INTO
                vRutaUsuarioBicicletaId
            
         FROM 	public."ePB_RutaUsuarioBicicleta" R
         JOIN	public."epb_bicicletapikpoint" B
                ON B."bicicletaid" = R."BicicletaId" 
         JOIN	public."ePB_Bicicleta" BB
            	ON BB."BicicletaId" = R."BicicletaId" 
         WHERE 	R."UsuarioId"  = vUsuarioId   
            	AND R."Est_RutaUsuarioBicicleta" in  (2,1)
                AND R."Est_Registro" = 1
                AND B."est_bicicleta" in  (2,1)
         LIMIT 1;

RETURN 	  cast('{"vRutaUsuarioBicicletaId": "'|| COALESCE(vRutaUsuarioBicicletaId, -1 )  ||'"}' AS json);
    	 
ELSE

	
    SELECt 	u."UsuarioId"
            INTO
            vUsuarioId
    FROM 	public."ePB_Usuario" u
    WHERE	U.email= vEmail;
    
	RETURN 	COALESCE(
    		array_to_json(array_agg(TP.*)) ,
    		cast('[{"RutaUsuarioBicicletaId": "-1"}]' AS json)
    	)
        FROM 
        (
        SELECT
                R."RutaUsuarioBicicletaId" ,
                R."BicicletaId",
            	B."est_registro",
				R."PickPointId_Origen",
            	R."PickPointId_Destino",
            	bb."clave_candado",
            	cast( COALESCE((EXTRACT(EPOCH FROM now() AT TIME ZONE 'UTC 5') - EXTRACT(EPOCH FROM  cast(R."Hora_Inicio" as timestamp))),0) as integer) AS hora_transcurrida,
            	R."Est_RutaUsuarioBicicleta",
            	vUsuarioId AS UsuarioId 
            
         FROM 	public."ePB_RutaUsuarioBicicleta" R
         JOIN	public."epb_bicicletapikpoint" B
                ON B."bicicletaid" = R."BicicletaId" 
         JOIN	public."ePB_Bicicleta" BB
            	ON BB."BicicletaId" = R."BicicletaId" 
         WHERE 	R."UsuarioId"  = vUsuarioId   
            	AND R."Est_RutaUsuarioBicicleta" in  (2,1)
        ) TP;
END IF;

END;

$BODY$;

ALTER FUNCTION public.epb_fnc_ruta_enviaje_sel(character varying)
    OWNER TO pikbik;
