import * as worldmap from './worldmap';
import {VectorMap } from '@south-paw/react-vector-maps';
console.log({...worldmap['default']});


// export const ReactVectorMap = <VectorMap {...worldmap} />;

// export class ReactVectorMap extends React.Component {
//     render() {
//       return <VectorMap {...worldmap['default']} />;
//     }
// };

export const ReactVectorMap = function() {
    const style = { margin: '1rem auto', width: '300px' };
  
    const [selected, setSelected] = React.useState([]);
  
    const onClick = ({ target }) => {
      const id = target.attributes.id.value;
  
      // If selected includes the id already, remove it - otherwise add it
      selected.includes(id)
        ? setSelected(selected.filter(sid => sid !== id))
        : setSelected([...selected, id]);
    }
  
    return (
      <div style={style}>
        <VectorMap {...worldmap['default']} layerProps={{ onClick }} />
        <hr />
        <p>Selected:</p>
        <pre>{JSON.stringify(selected,null,2)}</pre>
      </div>
    );
  }
// export const ReactVectorMap;