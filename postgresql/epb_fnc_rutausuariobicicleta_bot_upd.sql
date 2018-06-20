-- FUNCTION: public.epb_fnc_rutausuariobicicleta_bot_upd(character varying)

-- DROP FUNCTION public.epb_fnc_rutausuariobicicleta_bot_upd(character varying);

CREATE OR REPLACE FUNCTION public.epb_fnc_rutausuariobicicleta_bot_upd(
	pdatacabecerajson character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$

DECLARE vRutaUsuarioBicicletaId BIGINT; 
DECLARE vCategoriaRutaValId INTEGER; 

BEGIN

SELECT 	
		cast(jColumn->> 'rutaUsuariobicicletaid' AS BIGINT),
        cast(jColumn->> 'categoriarutavalid' AS INTEGER)
        
    	INTO
        vRutaUsuarioBicicletaId,
    	vCategoriaRutaValId 
        
FROM 	(SELECT cast(pDataCabeceraJson AS json) as  jColumn ) as jTable;

UPDATE	public."ePB_RutaUsuarioBicicleta"
SET		"CategoriaRutaValId" 		= vCategoriaRutaValId
WHERE	"RutaUsuarioBicicletaId" 	= vRutaUsuarioBicicletaId;
 
if(vCategoriaRutaValId = 3)THEN
	RETURN 	cast('[{"resultado": "OK|AudioTexo"}]' AS json);
ELSIF  (vCategoriaRutaValId = 5) THEN
	RETURN 	cast('[{"resultado": "OK|AudioTexo"}]' AS json);
ELSE
	RETURN 	cast('[{"resultado": "OK|OK"}]' AS json);
END IF;

END;

$BODY$;

ALTER FUNCTION public.epb_fnc_rutausuariobicicleta_bot_upd(character varying)
    OWNER TO pikbik;
