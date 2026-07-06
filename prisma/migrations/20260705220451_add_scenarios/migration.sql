-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scenarioText" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isCrossPillar" BOOLEAN NOT NULL DEFAULT false,
    "difficulty" TEXT NOT NULL,
    "modelAnswer" TEXT,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioPillar" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "pillarId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ScenarioPillar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioOption" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "ScenarioOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserScenarioAttempt" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "selectedOptionId" TEXT,
    "userAnswerText" TEXT,
    "isCorrect" BOOLEAN,
    "selfRating" TEXT,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserScenarioAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScenarioPillar" ADD CONSTRAINT "ScenarioPillar_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioPillar" ADD CONSTRAINT "ScenarioPillar_pillarId_fkey" FOREIGN KEY ("pillarId") REFERENCES "Pillar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScenarioOption" ADD CONSTRAINT "ScenarioOption_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScenarioAttempt" ADD CONSTRAINT "UserScenarioAttempt_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
