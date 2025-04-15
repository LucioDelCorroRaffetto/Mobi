const Propiedad = ({ titulo,imagen, ubicacion, descripcion }) => {
    return (
      <div className="propiedad-card">
        <h2>{titulo}</h2>
        <img src={imagen} alt="Foto de la propiedad" />
        <p className="ubicacion">{ubicacion}</p>
        <p className="descripcion">{descripcion}</p>
      </div>
    );
  };
  
  export default Propiedad;