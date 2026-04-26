"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  GraduationCap, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Trophy,
  Target,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react"

// Quiz questions based on real historical events
const QUIZ_QUESTIONS = [
  {
    id: "russia-ukraine-gold",
    event: "Russia Invades Ukraine",
    date: "February 24, 2022",
    description: "Russia launched a full-scale invasion of Ukraine, the largest military attack in Europe since WWII.",
    question: "What happened to Gold prices in the month following the invasion?",
    asset: "Gold",
    options: ["Rose significantly (+5% or more)", "Stayed roughly flat", "Dropped significantly (-5% or more)"],
    correct: 0,
    actualChange: "+8.2%",
    explanation: "Gold surged as investors fled to safe-haven assets. The uncertainty and geopolitical risk drove massive demand for gold as a store of value.",
    lesson: "Geopolitical crises typically boost gold prices as investors seek safety."
  },
  {
    id: "russia-ukraine-oil",
    event: "Russia Invades Ukraine",
    date: "February 24, 2022",
    description: "Russia is one of the world's largest oil exporters, supplying much of Europe's energy needs.",
    question: "What happened to Oil prices (Brent Crude) in the week after the invasion?",
    asset: "Oil",
    options: ["Rose significantly (+10% or more)", "Rose moderately (+3-10%)", "Stayed flat or dropped"],
    correct: 0,
    actualChange: "+25% (hit $130/barrel)",
    explanation: "Oil prices spiked dramatically as markets feared Russian supply disruptions. Brent crude briefly touched $130/barrel, the highest since 2008.",
    lesson: "Energy supply shocks from major producers cause immediate price spikes."
  },
  {
    id: "covid-crash-tsx",
    event: "COVID-19 Market Crash",
    date: "March 2020",
    description: "Global lockdowns were announced and the WHO declared COVID-19 a pandemic.",
    question: "How much did the TSX drop from its February peak to its March low?",
    asset: "TSX",
    options: ["About 15%", "About 25%", "About 37%"],
    correct: 2,
    actualChange: "-37% in one month",
    explanation: "The TSX experienced its fastest crash in history, falling from 17,944 to 11,228 in just one month as economic activity halted globally.",
    lesson: "Black swan events can cause rapid, severe market declines."
  },
  {
    id: "boc-rate-hike-housing",
    event: "Bank of Canada Rate Hike Cycle",
    date: "March 2022 - July 2023",
    description: "The BoC raised interest rates from 0.25% to 5.0% over 18 months to fight inflation.",
    question: "What happened to Canadian home prices during this rate hike cycle?",
    asset: "Housing",
    options: ["Continued rising (+10%)", "Stayed flat", "Dropped significantly (-15% or more)"],
    correct: 2,
    actualChange: "-18% from peak",
    explanation: "Higher mortgage rates crushed affordability. Monthly payments on a $500K mortgage rose by over $1,000, forcing buyers out of the market.",
    lesson: "Interest rates and housing prices have a strong inverse relationship."
  },
  {
    id: "trump-tariff-cad",
    event: "Trump Steel & Aluminum Tariffs",
    date: "March 2018",
    description: "The US announced 25% tariffs on steel and 10% on aluminum imports from Canada.",
    question: "What happened to the Canadian dollar (CAD) in the following month?",
    asset: "CAD",
    options: ["Strengthened vs USD", "Stayed roughly flat", "Weakened vs USD"],
    correct: 2,
    actualChange: "CAD fell from $0.79 to $0.76 USD",
    explanation: "Trade tensions weakened the CAD as markets feared economic damage to Canadian exports. The loonie dropped about 4% against the USD.",
    lesson: "Trade wars typically hurt the currencies of export-dependent economies."
  },
  {
    id: "2008-crisis-banks",
    event: "2008 Financial Crisis",
    date: "September - October 2008",
    description: "Lehman Brothers collapsed, triggering a global financial crisis.",
    question: "How did Canadian bank stocks (RY, TD, BMO) perform compared to US banks?",
    asset: "Bank Stocks",
    options: ["Canadian banks crashed harder", "Both crashed equally (~50%)", "Canadian banks fell less (~30%)"],
    correct: 2,
    actualChange: "Canadian banks: -30%, US banks: -70%",
    explanation: "Canadian banks were better regulated with stricter mortgage lending standards. No major Canadian bank required a government bailout.",
    lesson: "Strong regulation can provide downside protection during financial crises."
  },
  {
    id: "oil-crash-2020-energy",
    event: "Oil Price War + COVID",
    date: "March 2020",
    description: "Saudi Arabia and Russia started a price war while COVID crashed demand. WTI briefly went negative.",
    question: "What happened to Canadian energy stocks (ENB, SU, CNQ) in March 2020?",
    asset: "Energy Stocks",
    options: ["Dropped 20-30%", "Dropped 40-50%", "Dropped 60% or more"],
    correct: 1,
    actualChange: "-45% average",
    explanation: "The double shock of a price war and demand collapse devastated Canadian energy stocks. Suncor fell from $42 to $18 in one month.",
    lesson: "Energy stocks have high beta - they amplify oil price movements."
  },
  {
    id: "inflation-2022-gold",
    event: "40-Year High Inflation",
    date: "June 2022",
    description: "US inflation hit 9.1%, the highest since 1981. Canada reached 8.1%.",
    question: "Despite high inflation, what happened to gold in the 6 months after peak inflation?",
    asset: "Gold",
    options: ["Rose as an inflation hedge", "Stayed flat", "Actually fell despite inflation"],
    correct: 2,
    actualChange: "-5% (from $1,850 to $1,750)",
    explanation: "Counterintuitively, gold fell because the Fed raised rates aggressively. Higher rates increase the opportunity cost of holding non-yielding gold.",
    lesson: "Gold's relationship with inflation is complex - interest rate expectations matter more."
  },
]

export default function LearnGamePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])
  const [gameComplete, setGameComplete] = useState(false)
  const [streak, setStreak] = useState(0)

  const question = QUIZ_QUESTIONS[currentQuestion]
  const progress = (answeredQuestions.length / QUIZ_QUESTIONS.length) * 100

  const handleAnswer = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return
    
    setShowResult(true)
    setAnsweredQuestions([...answeredQuestions, currentQuestion])
    
    if (selectedAnswer === question.correct) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setGameComplete(true)
    }
  }

  const restartGame = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnsweredQuestions([])
    setGameComplete(false)
    setStreak(0)
  }

  const getScoreMessage = () => {
    const percentage = (score / QUIZ_QUESTIONS.length) * 100
    if (percentage >= 80) return { message: "Market Expert!", color: "text-chart-1" }
    if (percentage >= 60) return { message: "Solid Understanding", color: "text-accent" }
    if (percentage >= 40) return { message: "Learning Progress", color: "text-primary" }
    return { message: "Keep Learning!", color: "text-muted-foreground" }
  }

  if (gameComplete) {
    const { message, color } = getScoreMessage()
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className={`text-xl font-medium ${color}`}>{message}</p>
          
          <div className="max-w-md mx-auto mt-8 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary">{score}/{QUIZ_QUESTIONS.length}</p>
                  <p className="text-muted-foreground mt-1">Correct Answers</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-4 rounded-lg bg-secondary/50">
                    <p className="text-2xl font-bold text-chart-1">{Math.round((score / QUIZ_QUESTIONS.length) * 100)}%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-secondary/50">
                    <p className="text-2xl font-bold text-accent">{QUIZ_QUESTIONS.length}</p>
                    <p className="text-xs text-muted-foreground">Events Learned</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={restartGame} className="w-full" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Guess & Learn
          </h1>
          <p className="text-muted-foreground mt-1">
            Test your market intuition with real historical events
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Score: <span className="font-bold text-primary">{score}</span></span>
          </div>
          {streak >= 2 && (
            <Badge variant="secondary" className="mt-1">
              {streak} streak!
            </Badge>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{question.asset}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {question.date}
            </Badge>
          </div>
          <CardTitle className="text-xl">{question.event}</CardTitle>
          <CardDescription className="text-base">{question.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium text-lg">{question.question}</p>
          
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.correct
              const showCorrect = showResult && isCorrect
              const showWrong = showResult && isSelected && !isCorrect
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border text-left transition-all flex items-center gap-3 ${
                    showCorrect 
                      ? "border-chart-1 bg-chart-1/10" 
                      : showWrong 
                        ? "border-destructive bg-destructive/10"
                        : isSelected 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    showCorrect 
                      ? "border-chart-1 bg-chart-1 text-white" 
                      : showWrong 
                        ? "border-destructive bg-destructive text-white"
                        : isSelected 
                          ? "border-primary bg-primary text-white" 
                          : "border-muted-foreground"
                  }`}>
                    {showCorrect ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : showWrong ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                    )}
                  </div>
                  <span className={showCorrect ? "font-medium text-chart-1" : showWrong ? "text-destructive" : ""}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
        
        {!showResult ? (
          <CardFooter>
            <Button 
              onClick={submitAnswer} 
              disabled={selectedAnswer === null}
              className="w-full"
              size="lg"
            >
              Submit Answer
            </Button>
          </CardFooter>
        ) : (
          <CardFooter className="flex-col items-stretch gap-4">
            {/* Result Explanation */}
            <div className={`p-4 rounded-lg ${selectedAnswer === question.correct ? "bg-chart-1/10 border border-chart-1/20" : "bg-destructive/10 border border-destructive/20"}`}>
              <div className="flex items-start gap-3">
                {selectedAnswer === question.correct ? (
                  <CheckCircle2 className="h-5 w-5 text-chart-1 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${selectedAnswer === question.correct ? "text-chart-1" : "text-destructive"}`}>
                    {selectedAnswer === question.correct ? "Correct!" : "Not quite"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Actual result: <span className="font-medium text-foreground">{question.actualChange}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm">{question.explanation}</p>
                  <p className="text-sm font-medium text-primary mt-2">
                    Key Lesson: {question.lesson}
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={nextQuestion} size="lg">
              {currentQuestion < QUIZ_QUESTIONS.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  See Results
                  <Trophy className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
