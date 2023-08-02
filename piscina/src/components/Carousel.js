import React from 'react';
import '../App.css';

function Carousel(props) {
   return (
    <div id= {props.id} class="carousel slide" style = {{width: "70vh"}}>
    <div class="carousel-inner">
       {props.photos.slice(0,10).map((photo,index) => (
          <div key = {photo.id} className= { index === 0 ? 'carousel-item active' : 'carousel-item'} >
             <img src= {photo.thumbnailUrl} class="d-block w-100" alt="..."/>
             <div class="carousel-caption d-none d-md-block">
                <h5>{photo.title}</h5>
                <p>Some representative placeholder content for the first slide.</p>
              </div>
    </div>
        ))}
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target= {"#" + props.id} data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target= {"#" + props.id} data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
</div>   
   );
}

export default Carousel;