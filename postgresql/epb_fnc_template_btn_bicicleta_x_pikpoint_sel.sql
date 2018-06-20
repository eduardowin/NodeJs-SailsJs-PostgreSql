-- FUNCTION: public.epb_fnc_template_btn_bicicleta_x_pikpoint_sel(character varying)

-- DROP FUNCTION public.epb_fnc_template_btn_bicicleta_x_pikpoint_sel(character varying);

CREATE OR REPLACE FUNCTION public.epb_fnc_template_btn_bicicleta_x_pikpoint_sel(
	pdatacabecerajson character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$

DECLARE vpickpointid INTEGER; 
BEGIN
 
SELECT 	
		cast(jColumn->> 'pikpointId' AS INTEGER)
    	INTO
    	vpickpointid
FROM 	(SELECT cast(pDataCabeceraJson AS json) as  jColumn ) as jTable;

RETURN 	COALESCE(
    		array_to_json(array_agg(TP.*)) ,
    		cast('[{"bicicletaid": "-1"}]' AS json)
    	)
        FROM 
        (
        SELECT
                bp."bicicletaid" as bicicletaid ,
                bp."pickpointid" as pickpointid,
            	bp."est_bicicleta",
				b."Serie",
            	b."clave_candado"
            
         FROM 	epb_bicicletapikpoint as bp
         JOIN   "ePB_Bicicleta" as b
            	on bp.bicicletaid = b."BicicletaId"
         WHERE 	bp."est_bicicleta" = 0 and bp."pickpointid" = vpickpointid
        ) TP;
 
 
END;

$BODY$;

ALTER FUNCTION public.epb_fnc_template_btn_bicicleta_x_pikpoint_sel(character varying)
    OWNER TO pikbik;
