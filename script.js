(function() {
    /* --- NIEVE --- */
    const lienzo = document.getElementById('lienzo-nieve');
    const contexto = lienzo.getContext('2d');
    let ancho, alto;
    const copos = [];

    function ajustarTamano() {
        ancho = lienzo.width = window.innerWidth;
        alto = lienzo.height = window.innerHeight;
    }
    window.addEventListener('resize', ajustarTamano);
    ajustarTamano();

    class Copo {
        constructor() {
            this.resetear();
        }
        resetear() {
            this.x = Math.random() * ancho;
            this.y = Math.random() * -alto;
            this.velocidad = Math.random() * 1 + 0.5;
            this.tamano = Math.random() * 2 + 1;
            this.opacidad = Math.random() * 0.4 + 0.1;
        }
        actualizar() {
            this.y += this.velocidad;
            if (this.y > alto) this.resetear();
        }
        dibujar() {
            contexto.fillStyle = `rgba(255, 255, 255, ${this.opacidad})`;
            contexto.beginPath();
            contexto.arc(this.x, this.y, this.tamano, 0, Math.PI * 2);
            contexto.fill();
        }
    }

    for(let i=0; i<50; i++) copos.push(new Copo());

    function animar() {
        contexto.clearRect(0, 0, ancho, alto);
        copos.forEach(c => { c.actualizar(); c.dibujar(); });
        requestAnimationFrame(animar);
    }
    animar();

    /* --- LÓGICA DE APERTURA --- */
    const entrada = document.getElementById('entrada-clave');
    const boton = document.getElementById('boton-abrir');
    const contenedorLogin = document.getElementById('contenedor-login');
    const contenedorCarta = document.getElementById('contenedor-carta');
    const pergamino = document.getElementById('pergamino');
    const solapaSuperior = document.getElementById('solapa-top');
    
    const audio = document.getElementById('reproductor-audio');
    const botonMusica = document.getElementById('boton-musica');
    let reproduciendo = false;

    function verificar() {
        const valor = entrada.value.trim().toLowerCase();
        if (valor === 'home') {
            iniciarApertura();
        } else {
            entrada.classList.add('temblor');
            entrada.style.borderColor = '#ef4444';
            setTimeout(() => {
                entrada.classList.remove('temblor');
                entrada.style.borderColor = '#d4af37';
            }, 500);
        }
    }

    function iniciarApertura() {
        // Iniciar Audio
        audio.play().then(() => {
            reproduciendo = true;
            botonMusica.style.display = 'flex'; 
        }).catch(e => {
            console.log("Audio no automático", e);
            botonMusica.style.display = 'flex'; 
        });

        // Animación Sobre
        solapaSuperior.style.transform = "rotateX(180deg)";
        solapaSuperior.style.zIndex = "1"; 
        
        // Transición a Carta
        setTimeout(() => {
            contenedorLogin.classList.add('oculto');
            
            setTimeout(() => {
                contenedorLogin.style.display = 'none';
                // IMPORTANTE: Se usa 'block' para que funcione el scroll normal
                contenedorCarta.style.display = 'block'; 
                
                setTimeout(() => {
                    pergamino.classList.add('abierto');
                }, 100);
            }, 600);
        }, 400);
    }

    botonMusica.addEventListener('click', () => {
        if (reproduciendo) {
            audio.pause();
            reproduciendo = false;
            botonMusica.style.opacity = "0.5";
        } else {
            audio.play();
            reproduciendo = true;
            botonMusica.style.opacity = "1";
        }
    });

    boton.addEventListener('click', verificar);
    entrada.addEventListener('keypress', (evento) => {
        if(evento.key === 'Enter') verificar();
    });

})();
