export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6 text-black">Visualizador de Caminho em Labirinto</h1>
      <p className="text-center max-w-2xl mb-8 text-gray-600">
        Desenhe um labirinto clicando nas células para criar paredes. Defina os pontos de início e fim, e veja o
        algoritmo BFS encontrar o caminho mais curto.
      </p>
    </main>
  )
}