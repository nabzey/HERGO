declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.jpeg';
declare module '*.jpg';
declare module '*.png';
declare module '*.gif';
declare module '*.svg';