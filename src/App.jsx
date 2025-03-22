import { useState } from 'react';

function App() {
  const [blocks, setBlocks] = useState([{
    id: 0,
    x: Math.random() * (window.innerWidth - 100),
    y: Math.random() * (window.innerHeight - 100),
    parentId: null
  }]);

  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, id) => {
    const block = blocks.find(b => b.id === id);
    setDragging(id);
    setOffset({
      x: e.clientX - block.x,
      y: e.clientY - block.y
    });
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (dragging !== null) {
      setBlocks(blocks.map(block => {
        if (block.id === dragging) {
          return {
            ...block,
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
          };
        }
        return block;
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const addBlock = (parentId) => {
    const newBlock = {
      id: blocks.length,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
      parentId
    };
    setBlocks([...blocks, newBlock]);
  };


  return <>
    <div
      className="relative w-screen h-screen bg-pink-100"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Draw lines first so they appear under blocks */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {blocks.map(block => {
          if (block.parentId !== null) {
            const parent = blocks.find(b => b.id === block.parentId);
            return (
              <line
                key={`line-${block.id}`}
                x1={parent.x + 48}
                y1={parent.y + 48}
                x2={block.x + 48}
                y2={block.y + 48}
                stroke="black"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            );
          }
          return null;
        })}
      </svg>

      {/* Render blocks */}
      {blocks.map(block => (
        <div
          key={block.id}
          className="absolute w-24 h-24 bg-pink-600 text-white cursor-move flex flex-col items-center justify-between py-4"
          style={{
            left: block.x,
            top: block.y,
            touchAction: 'none'
          }}
          onMouseDown={(e) => handleMouseDown(e, block.id)}
        >
          <div className="text-xl">{block.id}</div>
          <button
            className="w-8 h-8 bg-pink-300 hover:bg-pink-400 text-xl flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              addBlock(block.id);
            }}
          >
            +
          </button>
        </div>
      ))}
    </div>
    </>;
}

export default App;
