import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts", // Onde vamos criar o nosso trabalhador
  swDest: "public/sw.js", // Onde ele vai ser gerado
  reloadOnOnline: true,   // Ajuda a atualizar o app quando a internet volta
  disable: process.env.NODE_ENV === "development", // Desliga no seu PC para não atrapalhar os testes, liga na Vercel
});

export default withSerwist({
  reactStrictMode: true,
});