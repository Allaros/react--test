import React from 'react';
import './App.css';

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

export interface Param {
   id: number;
   name: string;
   type: 'string';
}
export interface ParamValue {
   paramId: number;
   value: string;
}
export interface Model {
   paramValues: ParamValue[];
   colors?: Color[];
}

export interface Color {
   name: string;
   code: string;
}
interface Props {
   params: Param[];
   model: Model;
}

interface State {
   values: Record<number, string>;
}

const StringParamInput = ({
   param,
   value,
   onChange,
}: {
   param: Param;
   value: string;
   onChange: (newValue: string) => void;
}) => {
   return (
      <div className="textfield">
         <label className="label" htmlFor={`${param.id}`}>
            {param.name}
         </label>
         <input
            className="inp"
            type="text"
            id={`${param.id}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
         />
      </div>
   );
};

class ParamEditor extends React.Component<Props, State> {
   constructor(props: Props) {
      super(props);

      const values: Record<number, string> = {};
      props.model.paramValues.forEach((pv) => {
         values[pv.paramId] = pv.value;
      });

      this.state = { values };
   }

   public getModel(): Model {
      const paramValues: ParamValue[] = this.props.params.map((p) => ({
         paramId: p.id,
         value: this.state.values[p.id] || '',
      }));

      return { ...this.props.model, paramValues };
   }

   handleChange = (paramId: number, value: string) => {
      this.setState((prev) => ({
         values: { ...prev.values, [paramId]: value },
      }));
   };

   renderParam = (param: Param) => {
      switch (param.type) {
         case 'string':
            return (
               <StringParamInput
                  key={param.id}
                  param={param}
                  value={this.state.values[param.id] || ''}
                  onChange={(v) => this.handleChange(param.id, v)}
               />
            );
         default:
            return null;
      }
   };

   render() {
      return (
         <div className="form">{this.props.params.map(this.renderParam)}</div>
      );
   }
}

export { ParamEditor };

const App: React.FC = () => {
   const editorRef = React.useRef<ParamEditor>(null);

   const handleGetModel = () => {
      if (editorRef.current) {
         console.log(editorRef.current.getModel());
      }
   };

   return (
      <div className="wrapper">
         <div className="container">
            <h1 className="title">Редактор параметров</h1>
            <ParamEditor ref={editorRef} params={params} model={model} />
            <button
               className="button"
               onClick={handleGetModel}
               style={{ marginTop: '10px' }}
            >
               Получить модель в консоль
            </button>
         </div>
      </div>
   );
};

export default App;
