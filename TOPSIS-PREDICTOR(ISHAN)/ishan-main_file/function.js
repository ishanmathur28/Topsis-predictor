import * as math from 'mathjs';

function topsis(matrix,weights,impacts){

  const transposedMatrix = [];

  // Loop through each column
  for (let col = 0; col < matrix[0].length; col++) {
    const newRow = [];

    // Loop through each row, adding elements to the new row (column in transposed)
    for (let row = 0; row < matrix.length; row++) {
      newRow.push(matrix[row][col]);
    }

    transposedMatrix.push(newRow);
  }
  let square=[]
 
  for(let i=0;i<transposedMatrix.length;i++){
    let sum=0;
    for (let j = 0; j < transposedMatrix[0].length; j++) {
      sum= sum + transposedMatrix[i][j]*transposedMatrix[i][j];
    }
    square.push(sum)
  }

  
  for(let i=0;i<square.length;i++){
    square[i]=math.sqrt(square[i]);
  }
  console.log("Square",square)

  for(let i=0;i<matrix.length;i++){
    for (let j = 0; j < matrix[0].length; j++) {
      matrix[i][j]=matrix[i][j]/square[j]
    }
  }














    const normalizedMatrix = matrix;
   
    console.log(normalizedMatrix)


const weightedNormalizedMatrix = math.multiply(normalizedMatrix, math.diag(weights));
  console.log(weightedNormalizedMatrix);
  const newmatrix = math.matrix(weightedNormalizedMatrix);
  const axis=0;

const idealPositive = math.max(newmatrix, 0)._data; 


const idealNegative = math.min(newmatrix, 0)._data; 
for(let i=0;i<impacts.length;i++){
  if(impacts[i]==-1){
    [idealPositive[i],idealNegative[i]]=[idealNegative[i],idealPositive[i]];
  }
}
console.log('Ideal Positive (Max):', idealPositive);
console.log('Ideal Negative (Min):', idealNegative);



const pd=[];

for (let i = 0; i < weightedNormalizedMatrix.length; i++){
   
   const sub=math.sum(math.map(math.subtract(weightedNormalizedMatrix[i],idealPositive),math.square));
   const sub_sqrt=math.sqrt(sub);
   pd.push(sub_sqrt);
   
}

  

const nd=[];

for (let i = 0; i < weightedNormalizedMatrix.length; i++){
   
   const sub=math.sum(math.map(math.subtract(weightedNormalizedMatrix[i],idealNegative),math.square));
   const sub_sqrt=math.sqrt(sub);
   nd.push(sub_sqrt);
  
}




const sum_of_distances=[];
for (let i = 0; i < pd.length; i++){
  const s=pd[i]+nd[i];
  sum_of_distances.push(s);
}
// const sum_of_distances=math.sum(pd,nd);
const performance=[];
for (let i = 0; i < pd.length; i++){
  const d=nd[i]/sum_of_distances[i];
  performance.push(d);
}



const myMap = new Map();
for(let i=0;i<performance.length;i++){
  myMap.set(performance[i],i);
}
const sorted_performance = performance.slice().sort((a, b) => b - a);
const ranking = Array(performance.length).fill(0);
let rank=1;
for(let i=0;i<sorted_performance.length;i++){
  
  ranking[myMap.get(sorted_performance[i])]=rank;
  rank++;
}
console.log(performance);
console.log(ranking);
return ranking;
 }
export {topsis}










// const transposedMatrix = [];

//   // Loop through each column
//   for (let col = 0; col < matrix[0].length; col++) {
//     const newRow = [];

//     // Loop through each row, adding elements to the new row (column in transposed)
//     for (let row = 0; row < matrix.length; row++) {
//       newRow.push(matrix[row][col]);
//     }

//     transposedMatrix.push(newRow);
//   }
//   let square=[]
 
//   for(let i=0;i<transposedMatrix[0].length;i++){
//     let sum=0;
//     for (let j = 0; j < transposedMatrix.length; j++) {
//       sum= sum + transposedMatrix[i][j]*transposedMatrix[i][j];
//     }
//     square.push(sum)
//   }


//   for(let i=0;i<matrix[0].length;i++){
//     for (let j = 0; j < matrix.length; j++) {
//       matrix[i][j]=matrix[i][j]/square[j]
//     }
//   }