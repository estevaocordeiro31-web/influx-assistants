          )}
        </DialogContent>
      </Dialog>

      {/* Quiz Modal */}
      {showQuiz && selectedLesson && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <VacationQuiz
            lessonId={selectedLesson.id}
            lessonTitle={selectedLesson.title}
            onComplete={(score, total) => {
              const passed = score / total >= 0.6;
              setQuizScores(prev => ({ ...prev, [selectedLesson.id]: { score, total } }));
              
              // Salvar resultado no banco de dados
              saveQuizMutation.mutate({
                lessonNumber: selectedLesson.id,
                score,
                totalQuestions: total,
                passed,
              });
              
              if (passed && !completedLessons.includes(selectedLesson.id)) {
                setCompletedLessons(prev => [...prev, selectedLesson.id]);
                toast.success(`Licao ${selectedLesson.id} concluida!`);
                
                // Check if all lessons completed
                if (completedLessons.length + 1 >= 8) {
                  setTimeout(() => {
                    setShowCertificate(true);
                  }, 2000);
                }
              }
            }}
            onClose={() => {
              setShowQuiz(false);
            }}
          />
        </div>
      )}