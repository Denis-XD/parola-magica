import { Howl } from 'howler';

export const reproducirPalabra = (categoria, palabra) => {
  const sonido = new Howl({
    src: [`/audio/${categoria}/${palabra}.mp3`],
  });
  sonido.play();
};
