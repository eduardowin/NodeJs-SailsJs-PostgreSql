-- FUNCTION: public.epb_fnc_bot_lista_pikpoint_geoposicion_sel(character varying)

-- DROP FUNCTION public.epb_fnc_bot_lista_pikpoint_geoposicion_sel(character varying);

CREATE OR REPLACE FUNCTION public.epb_fnc_bot_lista_pikpoint_geoposicion_sel(
	pdatacabecerajson character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$

DECLARE vLatA double precision;
DECLARE vLonA double precision;
DECLARE vOrigen  Integer; -- 1 es pikpoint inicial, 2 es pikpoint final
DECLARE vPickPointId  BIGINT; -- 1 es pikpoint inicial, 2 es pikpoint final

BEGIN

SELECT 	
		cast(jColumn->> 'latitude' AS double precision),
        cast(jColumn->> 'longitude' AS double precision),        
        cast(jColumn->> 'esorigen' AS INTEGER),
        cast(jColumn->> 'pickpointid' AS BIGINT)
    	INTO
        vLatA,
        vLonA,
        vOrigen,
        vPickPointId
        
FROM 	(SELECT cast(pDataCabeceraJson AS json) as  jColumn ) as jTable;

if(vOrigen = 1) THEN

    RETURN 	COALESCE(
                array_to_json(array_agg(TP.*)) ,
                cast('[{"PickPointId": "-1"}]' AS json)
            )
            FROM 
            (
            SELECT
                    R."PickPointId" ,
                    R."Cod_PickPoint",
                    R."Nombre",
                    R."Direccion",
                    R."Cnt_Bici_Disponible",
                    R."Cnt_Bici_Reservado" ,
                    R."url_Imagen_ref" ,
                    epb_fnc_geodistance(R."Latitud",R."Longitud",vLatA,vLonA,1 ) as cercania,
                    cast((epb_fnc_geodistance(R."Latitud",R."Longitud",vLatA,vLonA,1 )*1000)as INTEGER)  as cercaniametros
             FROM 	public."ePB_PickPoint" R
             WHERE 	R."Est_Registro" = 1
                    AND R."Cnt_Bici_Disponible" > 0
                    --AND R."PickPointId" != vPickPointId
                    AND epb_fnc_geodistance(R."Latitud",R."Longitud",vLatA,vLonA,1 ) <= 1.5
             ORDER BY cercania ASC
             LIMIT 10
            ) TP;
ELSE
	RETURN 	COALESCE(
                array_to_json(array_agg(TP.*)) ,
                cast('[{"PickPointId": "-1"}]' AS json)
            )
            FROM 
            (
            SELECT
                    R."PickPointId" ,
                    R."Cod_PickPoint",
                    R."Nombre",
                    R."Direccion",
                    R."Cnt_Bici_Disponible",
                    R."Cnt_Bici_Reservado" ,
                    R."url_Imagen_ref" ,
                    epb_fnc_geodistance(R."Latitud",R."Longitud",vLatA,vLonA,1 ) as cercania,
                	cast((epb_fnc_geodistance(R."Latitud",R."Longitud",vLatA,vLonA,1 )*1000)as INTEGER)  as cercaniametros
             FROM 	public."ePB_PickPoint" R
             WHERE 	R."Est_Registro" = 1
                    --AND R."Cnt_Bici_Disponible" > 0
                    AND R."PickPointId" != vPickPointId
                    AND epb_fnc_geodistance(R."Latitud",R."Longitud",vLatA,vLonA,1 ) <= 1.5
             ORDER BY cercania ASC
             LIMIT 10
            ) TP;
END IF;

END;

$BODY$;

ALTER FUNCTION public.epb_fnc_bot_lista_pikpoint_geoposicion_sel(character varying)
    OWNER TO pikbik;
