function deleteFirstColumn(matrix) {
    return matrix.map(row => row.slice(1));
  }

  export {deleteFirstColumn};