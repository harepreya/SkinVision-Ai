export async function getProgress(): Promise<
  {
    date: string
    score: number
    hydration: number
    texture: number
    clarity: number
  }[]
> {
  // Placeholder progress data
  // In a real application, this would fetch data from a database
  return [
    {
      date: "2023-01-01",
      score: 60,
      hydration: 55,
      texture: 62,
      clarity: 58,
    },
    {
      date: "2023-02-01",
      score: 65,
      hydration: 63,
      texture: 64,
      clarity: 62,
    },
    {
      date: "2023-03-01",
      score: 70,
      hydration: 68,
      texture: 69,
      clarity: 67,
    },
    {
      date: "2023-04-01",
      score: 75,
      hydration: 74,
      texture: 73,
      clarity: 72,
    },
    {
      date: "2023-05-01",
      score: 80,
      hydration: 79,
      texture: 78,
      clarity: 77,
    },
    {
      date: "2023-06-01",
      score: 85,
      hydration: 84,
      texture: 83,
      clarity: 82,
    },
  ]
}

