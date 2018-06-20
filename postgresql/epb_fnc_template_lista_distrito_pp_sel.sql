-- FUNCTION: public.epb_fnc_template_lista_distrito_pp_sel()

-- DROP FUNCTION public.epb_fnc_template_lista_distrito_pp_sel();

CREATE OR REPLACE FUNCTION public.epb_fnc_template_lista_distrito_pp_sel(
	)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$

 
BEGIN
 
RETURN 	COALESCE(
    		array_to_json(array_agg(TP.*)) ,
    		cast('[{"PickPointId": "-1"}]' AS json)
    	)
        FROM 
        (
        SELECT  DISTINCT
                R."Des_Distrito"
                 
         FROM 	public."ePB_PickPoint" R
         WHERE 	R."Est_Registro" = 1
        ) TP;

END;

$BODY$;

ALTER FUNCTION public.epb_fnc_template_lista_distrito_pp_sel()
    OWNER TO pikbik;
