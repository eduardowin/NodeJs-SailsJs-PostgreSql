-- FUNCTION: public.epb_fnc_usuario_ins_val(character varying)

-- DROP FUNCTION public.epb_fnc_usuario_ins_val(character varying);

CREATE OR REPLACE FUNCTION public.epb_fnc_usuario_ins_val(
	pdatacabecerajson character varying)
    RETURNS character varying
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$

DECLARE vEmail VARCHAR(120);
DECLARE vExisteEmail INT;
DECLARE vResultado VARCHAR(100);
BEGIN

SELECt 	jColumn->> 'email'
    	INTO
    	vEmail
FROM 	(SELECT cast(pDataCabeceraJson AS json) as  jColumn ) as jTable;

SELECt 	COUNT(1)
    	INTO
    	vExisteEmail
FROM 	public."ePB_Usuario" U
WHERE	U.email = vEmail;

SELECT CASE	
        	WHEN vExisteEmail=1
            	THEN 'Este correo ya esta en uso'
       		ELSE 'OK'
     	END
     	INTO
     	vResultado
     ;
 
RETURN vResultado;

END;

$BODY$;

ALTER FUNCTION public.epb_fnc_usuario_ins_val(character varying)
    OWNER TO pikbik;
