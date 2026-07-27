import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExplanationPanel } from './ExplanationPanel';
import type { QuizQuestion } from '../data/curriculum';

const mockQuiz: QuizQuestion[] = [
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswerIndex: 1,
    explanation: "Basic math states that 2 + 2 = 4."
  },
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Rome"],
    correctAnswerIndex: 2,
    explanation: "Paris is the capital of France."
  }
];

describe('ExplanationPanel Quiz Mode', () => {
  it('renders overview and enters quiz mode', () => {
    const onToggleDepth = vi.fn();
    const onHoverTerm = vi.fn();
    const onLeaveTerm = vi.fn();
    const onAskTutor = vi.fn();

    render(
      <ExplanationPanel
        node={null}
        isOpen={true}
        onClose={vi.fn()}
        onHoverTerm={onHoverTerm}
        onLeaveTerm={onLeaveTerm}
        onAskTutor={onAskTutor}
        isSimple={false}
        onToggleDepth={onToggleDepth}
        quiz={mockQuiz}
        activeTopicTitle="Test Topic"
      />
    );

    // Should display topic title and the "Take Quiz" button
    expect(screen.getByText('Test Topic')).toBeInTheDocument();
    const takeQuizBtn = screen.getByText(/Take Quiz/);
    expect(takeQuizBtn).toBeInTheDocument();

    // Click Take Quiz
    fireEvent.click(takeQuizBtn);

    // Verify first question is shown
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    
    // Choose incorrect option A ('3')
    const optionA = screen.getByText('3');
    fireEvent.click(optionA);

    // Verify explanation is shown
    expect(screen.getByText(/Basic math states/)).toBeInTheDocument();

    // Click Next Question
    const nextBtn = screen.getByText('Next Question →');
    fireEvent.click(nextBtn);

    // Verify second question is shown
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument();
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();

    // Choose correct option C ('Paris')
    const optionC = screen.getByText('Paris');
    fireEvent.click(optionC);

    // Click Finish Quiz
    const finishBtn = screen.getByText('Finish Quiz');
    fireEvent.click(finishBtn);

    // Verify score screen
    expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
    expect(screen.getByText(/You scored/)).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
