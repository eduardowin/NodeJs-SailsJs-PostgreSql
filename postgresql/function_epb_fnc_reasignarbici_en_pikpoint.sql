-- FUNCTION: public.epb_fnc_reasignarbici_en_pikpoint(integer)

-- DROP FUNCTION public.epb_fnc_reasignarbici_en_pikpoint(integer);

CREATE OR REPLACE FUNCTION public.epb_fnc_reasignarbici_en_pikpoint(
	ppikpoint integer)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE 
    ROWS 0
AS $BODY$

DECLARE 
 titles TEXT DEFAULT '';
 rec_Bicicleras   RECORD;
 cur_Bicicleras CURSOR(pPikPoint INTEGER) 
 FOR 
 	SELECT  "BicicletaId"
 	FROM	public."ePB_Bicicleta"
    WHERE	"Est_Registro" = 1
    		AND "Est_Bicicleta" = 1
 	and  	"BicicletaId"  in (1,2,4,5) ;
BEGIN
   -- Open the cursor
   OPEN cur_Bicicleras(pPikPoint);
 
   LOOP
    -- fetch row into the film
      FETCH cur_Bicicleras INTO rec_Bicicleras;
    -- exit when no more row to fetch
      EXIT WHEN NOT FOUND;
      
      UPDATE 	public."epb_bicicletapikpoint"
      SET		"est_registro" = 0,
      			"est_bicicleta" = -1
      WHERE 	"bicicletaid" = 	rec_Bicicleras."BicicletaId"
      			AND "est_registro" = 1
                AND  "est_bicicleta" = 0;
                
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
            pPikPoint,
            rec_Bicicleras."BicicletaId",
            0,
            1,
            current_timestamp AT TIME ZONE 'UTC 5'
        );
                

      	
  
   END LOOP;
  
   -- Close the cursor
   CLOSE cur_Bicicleras;
 
  UPDATE	public."ePB_PickPoint" A
  SET		"Cnt_Bici_Disponible" = (SELECT   COUNT(1)
                                   FROM 	public."epb_bicicletapikpoint" D
                                   WHERE 	D."est_registro" = 1
                                            AND  D."est_bicicleta" = 0
                                            AND D."pickpointid" = A."PickPointId");
  --FROM 		public."ePB_PickPoint" A
  --WHERE		"PickPointId" = pPikPoint;
 
   RETURN titles;
END; 

$BODY$;

ALTER FUNCTION public.epb_fnc_reasignarbici_en_pikpoint(integer)
    OWNER TO pikbik;

