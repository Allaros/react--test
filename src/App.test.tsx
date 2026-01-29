import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App, { ParamEditor, Param, Model } from './App';

const params: Param[] = [
   { id: 1, name: 'Назначение', type: 'string' },
   { id: 2, name: 'Длина', type: 'string' },
];

const model: Model = {
   paramValues: [
      { paramId: 1, value: 'повседневное' },
      { paramId: 2, value: 'макси' },
   ],
};

describe('ParamEditor', () => {
   test('отрисовывает все поля по params', () => {
      render(<ParamEditor params={params} model={model} />);

      params.forEach((p) => {
         const input = screen.getByLabelText(p.name) as HTMLInputElement;
         expect(input).toBeInTheDocument();
         expect(input.value).toBe(
            model.paramValues.find((v) => v.paramId === p.id)?.value
         );
      });
   });

   test('инициализация state из model.paramValues корректная', () => {
      const editorRef = React.createRef<ParamEditor>();
      render(<ParamEditor ref={editorRef} params={params} model={model} />);

      const stateValues = editorRef.current?.state.values;
      expect(stateValues).toEqual({
         1: 'повседневное',
         2: 'макси',
      });
   });

   test('getModel() возвращает обновленные значения после изменения', () => {
      const editorRef = React.createRef<ParamEditor>();
      render(<ParamEditor ref={editorRef} params={params} model={model} />);

      const input1 = screen.getByLabelText('Назначение') as HTMLInputElement;
      fireEvent.change(input1, { target: { value: 'вечернее' } });

      const input2 = screen.getByLabelText('Длина') as HTMLInputElement;
      fireEvent.change(input2, { target: { value: 'мини' } });

      const updatedModel = editorRef.current?.getModel();
      expect(updatedModel?.paramValues).toEqual([
         { paramId: 1, value: 'вечернее' },
         { paramId: 2, value: 'мини' },
      ]);
   });
});

describe('App', () => {
   test('рендерит ParamEditor и кнопку', () => {
      render(<App />);
      const button = screen.getByText('Получить модель в консоль');
      expect(button).toBeInTheDocument();

      params.forEach((p) => {
         expect(screen.getByLabelText(p.name)).toBeInTheDocument();
      });
   });
});
