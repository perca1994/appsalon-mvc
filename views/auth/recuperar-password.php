<h1 class="nombre-pagina">Recuperar Password</h1>
<p class="descripcion-pagina">Coloca tu nuevo password a continuación</p>

<?php include_once __DIR__ ."/../templates/alertas.php"  ?>

<?php if($error) return ; ?>


<form  method="POST" class="formulario">

<div class="campo">
    <label for="password">Password</label>
    <input type="password" name="password" id="password" placeholder="Tu Nuevo password">
</div>
<input type="submit" value="Guardar Nuevo Password" class="boton">
</form>



<div class="acciones">
    <a href="/">¿ya tiene cuenta? Iniciar sesión</a>
    <a href="/crear-cuenta">¿Aun no tienes una cuenta? Crear una</a>
</div>