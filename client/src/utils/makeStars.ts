export const makeStars = ($sky: Element) => {
  const maxSize = Math.max(window.innerWidth, window.innerHeight) * 2;
  const getRandomX = () => Math.random() * maxSize;
  const getRandomY = () => Math.random() * maxSize;
  const randomRadius = () => Math.random() * 0.7 + 0.6;
  const _size = Math.floor(maxSize / 2) * 2;

  const htmlDummy = new Array(_size)
    .fill(0)
    .map((_, i) => {
      return `<circle class='star'
        cx=${getRandomX()}
        cy=${getRandomY()}
        r=${randomRadius()}
        className="star" />`;
    })
    .join('');

  $sky.innerHTML = htmlDummy;
};
