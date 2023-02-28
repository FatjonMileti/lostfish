import React from 'react';

interface ButtonProps {
  label: string;
}

export const Button = (props: ButtonProps) => {
  const { label } = props;
  return (
    <span className='button'>
      <span className='buttonText'>{label}</span>
    </span>
  );
};
