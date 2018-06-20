-- FUNCTION: public.epb_fnc_template_lista_pikpoint_sel(character varying)

-- DROP FUNCTION public.epb_fnc_template_lista_pikpoint_sel(character varying);

CREATE OR REPLACE FUNCTION public.epb_fnc_template_lista_pikpoint_sel(
	pdatacabecerajson character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$

DECLARE vpickpointid INTEGER; 
DECLARE vDistrito CHARACTER VARYING;
DECLARE vPagina INTEGER; 

BEGIN

SELECT 	
		cast(jColumn->> 'pickpointid' AS BIGINT),
        cast(jColumn->> 'nombredistritopp' AS CHARACTER VARYING),
        cast(jColumn->> 'pagina' AS INTEGER) 
    	INTO
        vpickpointid,
        vDistrito,
        vPagina
        
FROM 	(SELECT cast(pDataCabeceraJson AS json) as  jColumn ) as jTable;
 
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
                    R."url_Imagen_ref"  
             FROM 	public."ePB_PickPoint" R
             WHERE 	R."Est_Registro" = 1
            		AND R."Des_Distrito" = replace(vDistrito, '_', ' ')
            
         ORDER BY R."Nombre"  
  		 LIMIT 10 OFFSET (10 * vPagina)
        ) TP;

END;

$BODY$;

ALTER FUNCTION public.epb_fnc_template_lista_pikpoint_sel(character varying)
    OWNER TO pikbik;
