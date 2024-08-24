<?php



namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;


class APIController{
    public static function index(){

      $servicios = Servicio::all();
          echo json_encode($servicios);

    }

    public static function guardar(){
       
        //Almacena la Cita y devuelve el ID
       $cita = new Cita($_POST);
       $resultado = $cita->guardar();
     
       $id = $resultado['id'];

     
        //Almacena la cita y el servicio

        $serviciosId = explode(",", $_POST['servicios']);

        foreach($serviciosId as $servicioId ){
         
            $args = [
                'citaId'=> $id,
                'servicioId'=>$servicioId
            ];
        
            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
    
        }
      
        echo json_encode(['resultado'=>$resultado]);

        
    }

      

 public static function eliminar(){
  if($_SERVER['REQUEST_METHOD'] === "POST"){
    $id = $_POST['id'];
    $cita = Cita::find($id);
    $cita->eliminar();

    header('Location:'.$_SERVER['HTTP_REFERER']);

  }
 }

}