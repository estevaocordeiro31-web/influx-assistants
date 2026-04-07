        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {isPassing ? (
              <div className="relative">
                <Trophy className="w-20 h-20 text-yellow-400" />
                <Sparkles className="w-8 h-8 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                <RotateCcw className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl text-white">
            {isPassing ? "Congratulations! 🎉" : "Keep Practicing! 💪"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2">
              {finalScore}/{questions.length}
            </div>
            <p className="text-gray-400">
              {percentage}% correct
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {answers.map((correct, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  correct ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
            ))}
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Your Performance:</h4>
            <div className="space-y-2 text-sm text-gray-400">
              {isPassing ? (
                <>
                  <p>✅ Great job understanding the cultural differences!</p>
                  <p>✅ You're ready to communicate with native speakers!</p>
                  <p>✅ Keep practicing to master these expressions!</p>
                </>
              ) : (
                <>
                  <p>📚 Review the lesson content again</p>
                  <p>🎧 Listen to the dialogues multiple times</p>
                  <p>💪 Try the quiz again when you're ready!</p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={restartQuiz}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600"
              onClick={onClose}
            >
              {isPassing ? "Continue" : "Back to Lesson"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="border-cyan-500 text-cyan-400">
            {lessonTitle}
          </Badge>
          <Badge className="bg-gray-700 text-gray-300">
            Question {currentQuestion + 1}/{questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2 bg-gray-700" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Character indicator */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getCharacterColor(question.character)} flex items-center justify-center text-2xl`}>
            {getCharacterFlag(question.character)}
          </div>
          <div>
            <p className="text-white font-medium capitalize">{question.character}</p>
            <p className="text-gray-400 text-sm">
              {question.character === "lucas" ? "New York, USA" : 
               question.character === "emily" ? "London, UK" : "Sydney, Australia"}
            </p>
          </div>
          {question.audioText && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
              onClick={playAudio}
              disabled={isPlaying}
            >
              <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
            </Button>
          )}
        </div>

        {/* Question */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg text-white font-medium">{question.question}</h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = idx === question.correctAnswer;
            const showCorrectness = showResult;

            let buttonClass = "w-full p-4 text-left rounded-lg border transition-all ";
            
            if (showCorrectness) {
              if (isCorrect) {
                buttonClass += "border-green-500 bg-green-500/20 text-green-400";
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-500/20 text-red-400";
              } else {
                buttonClass += "border-gray-700 bg-gray-800/50 text-gray-500";
              }
            } else {
              buttonClass += isSelected
                ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50";
            }

            return (
              <button