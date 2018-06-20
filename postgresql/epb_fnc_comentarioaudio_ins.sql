-- FUNCTION: public.epb_fnc_comentarioaudio_ins(character varying)

-- DROP FUNCTION public.epb_fnc_comentarioaudio_ins(character varying);

CREATE OR REPLACE FUNCTION public.epb_fnc_comentarioaudio_ins(
	pdatacabecerajson character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$

DECLARE vDes_Comentario CHARACTER VARYING ; 
DECLARE vNom_ArchivoAudio CHARACTER VARYING; 
DECLARE vRutaUsuarioBicicletaId  INTEGER; 
DECLARE vCategoriaRutaValId  INTEGER; 
 
BEGIN
        SELECT 	
                cast(jColumn->> 'Des_Comentario' AS CHARACTER VARYING),
                cast(jColumn->> 'Nom_ArchivoAudio' AS CHARACTER VARYING),
                cast(jColumn->> 'CategoriaRutaValId' AS INTEGER),
                cast(jColumn->> 'RutaUsuarioBicicletaId' AS BIGINT) 
                INTO
                vDes_Comentario,
                vNom_ArchivoAudio,
                vRutaUsuarioBicicletaId,
                vCategoriaRutaValId 

        FROM 	(SELECT cast(pDataCabeceraJson AS json) as  jColumn ) as jTable;
        
        INSERT INTO public."ePB_ComentarioAudio"
        (
            "Comentario",
            "Nom_ArchivoAudio",
            "RutaUsuarioBicicletaId",
            "CategoriaRutaValId",
            "Est_Registro",
            "Fec_Registro" 
        )
        VALUES
        (
            vDes_Comentario,
            vNom_ArchivoAudio,
            vRutaUsuarioBicicletaId,
            vCategoriaRutaValId,
            1,
            to_char(current_timestamp AT TIME ZONE 'UTC 5', 'YYYY-MM-DD HH:MI:SS')

        );
 
   
 
 RETURN  cast('[{"vRutaUsuarioBicicletaId": '|| cast('-1' AS CHARACTER VARYING) || ',"MsgResultado": "Gracias"}]' AS json);
  
END;

$BODY$;

ALTER FUNCTION public.epb_fnc_comentarioaudio_ins(character varying)
    OWNER TO pikbik;
