const unitTypeMap = new Map([
    ['inf', 0],    
    ['grd', 1],    
    ['cav', 2],   
    ['grc', 3],   
    ['art', 4],   
    ['eng', 5],  
  ]);
  //sorts the deployment of reserves.
function mergeSort(array) {
    if (array.length <= 1) {
      return array;
    }
  
    const middle = Math.floor(array.length / 2);
    const left = array.slice(0, middle);
    const right = array.slice(middle);
  
    return merge(mergeSort(left), mergeSort(right));
  }
  
  
  function merge(left, right) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;
  
    while (leftIndex < left.length && rightIndex < right.length) {
        l_unit=left[leftIndex].unittype;
        l_val = unitTypeMap.get(l_unit);
        r_unit=right[rightIndex].unittype;
        r_val = unitTypeMap.get(r_unit);
      if (l_val < r_val) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }
    return result.concat(left.slice(leftIndex), right.slice(rightIndex));
  }