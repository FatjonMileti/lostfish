import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import classNames from 'classnames';
import { Label } from '../../../components/Label';
import { useProfileStore } from '../../../globalState/profile';
import { Role } from '../../../enums';

import { IMessageItem } from '../messages.interface';
import { AnimatePresence, motion } from 'framer-motion';

type Question = {
  message: string;
  answers: string[];
};

const questions: Question[] = [
  {
    message: 'Do you have any pets?',
    answers: ['Yes', 'No']
  },
  {
    message: 'Do you have any children?',
    answers: ['Yes, i do have children', 'No, i dont have children']
  },
  {
    message: 'Do you know the move in date?',
    answers: ['Yes, I know', 'No, I dont know']
  }
];

interface SuggestedMessagesProps extends HTMLAttributes<HTMLDivElement> {
  sendMessage: ({ message }: { message: string }) => void;
  lastMessage?: IMessageItem;
}
export const SuggestedMessages = styled(({ className, sendMessage, lastMessage }: SuggestedMessagesProps) => {
  const profileStore = useProfileStore();

  return (
    <>
      <div className={classNames(className, 'suggested-messages')}>
        <AnimatePresence>
          {profileStore.role === Role.Client && (
            <SuggestedQuestions lastMessage={lastMessage} sendMessage={sendMessage} />
          )}

          {profileStore.role === Role.Landlord && (
            <SuggestedAnswers lastMessage={lastMessage} sendMessage={sendMessage} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
})`
  &.suggested-messages {
    width: 100%;
    background-color: white;

    .questions {
      justify-content: center;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      padding: 32px;
      box-sizing: border-box;
    }
  }
`;

interface SuggestedQuestionsProps extends HTMLAttributes<HTMLDivElement> {
  sendMessage: ({ message }: { message: string }) => void;
  lastMessage?: IMessageItem;
}
const SuggestedQuestions = styled(({ className, lastMessage, sendMessage }: SuggestedQuestionsProps) => {
  return (
    <>
      {!questions.find((q) => q.message === lastMessage?.message) && (
        <motion.div
          key='suggestedQuestions'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className={classNames(className, 'questions')}>
          {questions.map((question, questionIndex) => {
            return (
              <Label
                variant='secondary'
                key={questionIndex}
                onClick={() => sendMessage({ message: question.message })}>
                {question.message}
              </Label>
            );
          })}
        </motion.div>
      )}
    </>
  );
})`
  &.questions {
  }
`;

interface SuggestedAnswersProps extends HTMLAttributes<HTMLDivElement> {
  sendMessage: ({ message }: { message: string }) => void;
  lastMessage?: IMessageItem;
}
const SuggestedAnswers = styled(({ className, lastMessage, sendMessage }: SuggestedAnswersProps) => {
  let suggestedAnswers;

  if (lastMessage) {
    suggestedAnswers = questions.find((question) => question.message === lastMessage.message)?.answers;
  }

  return (
    <>
      {suggestedAnswers && suggestedAnswers?.length > 0 && (
        <motion.div
          key='suggestedAnswers'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className={classNames(className, 'questions')}>
          {suggestedAnswers?.map((suggestedAnswers) => (
            <Label variant='secondary' onClick={() => sendMessage({ message: suggestedAnswers })}>
              {suggestedAnswers}
            </Label>
          ))}
        </motion.div>
      )}
    </>
  );
})`
  &.questions {
  }
`;
