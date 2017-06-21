// Sudoku Solver
// The approach will be to just recursively solve each cell untill every cell is filled out correctly or we end up in an infinite loop.
// The sudoku will be treated as a 2d array.
// Each row, column and collection of adjacent 3x3 set of cells must have a unique arrangement of the digits 1 thru 9

// The sudoku board will be as follows:
// \col 0     1     2      3     4     5      6     7     8
//row ===== ===== =====  ===== ===== =====  ===== ===== =====
// 0||     |     |     ||     |     |     ||     |     |     ||
//    ----- ----- -----  ----- ----- -----  ----- ----- -----
// 1||     |     |     ||     |     |     ||     |     |     ||
//    ----- ----- -----  ----- ----- -----  ----- ----- -----
// 2||     |     |     ||     |     |     ||     |     |     ||
//    ===== ===== =====  ===== ===== =====  ===== ===== =====
// 3||     |     |     ||     |     |     ||     |     |     ||
//    ----- ----- -----  ----- ----- -----  ----- ----- -----
// 4||     |     |     ||     |     |     ||     |     |     ||
//    ----- ----- -----  ----- ----- -----  ----- ----- -----
// 5||     |     |     ||     |     |     ||     |     |     ||
//    ===== ===== =====  ===== ===== =====  ===== ===== =====
// 6||     |     |     ||     |     |     ||     |     |     ||
//    ----- ----- -----  ----- ----- -----  ----- ----- -----
// 7||     |     |     ||     |     |     ||     |     |     ||
//    ----- ----- -----  ----- ----- -----  ----- ----- -----
// 8||     |     |     ||     |     |     ||     |     |     ||
//    ===== ===== =====  ===== ===== =====  ===== ===== =====

// Accept the input as a string of numbers. Empty cells will be input as zero
// So for the sudoku, every input must have 81 chars. Checks the test data at the bottom for samples

let [input] = process.argv.slice(2)
let board     = [],
    R         = [],
    C         = [],
    B         = [],
    opts      = {},
    prevOpts  = {},
    loopCount = 0

// function to populate the board
function populateSudoku(input, board){
  let row    = [],
      rowCount= 0
  for(let inCount = 0; inCount < 81; inCount++){
    row.push(Number(input[inCount]))
    if (!((inCount + 1) % 9)){
      board[rowCount] = row
      rowCount++
      row = []
    }
  }
}

// create row (R), column (C) and block (B) arrays to make it easy for checking/updating
// C will be the transpose of R.
// B will the array of block arrays.
// Make sure to update these after every update to the board
function generateC(){
  let CRow = []
  C = []
  for(let x = 0; x < 9; x++){
    for(let y = 0; y < 9; y++){
      CRow.push(R[y][x])
    }
    C.push(CRow)
    CRow = []
  }
}

function generateB(){
  // B[0] = R[0][0] thru R[2][2].
  // B[1] = R[0][3] thru R[2][5].
  // B[2] = R[0][6] thru R[2][8].
  // B[3] = R[3][0] thru R[5][2].
  // B[4] = R[3][3] thru R[5][5].
  // B[5] = R[3][6] thru R[5][8].
  // B[6] = R[6][0] thru R[8][2].
  // B[7] = R[6][3] thru R[8][5].
  // B[8] = R[6][6] thru R[8][8].
  let BRow = [],
      addI = 0,
      addJ = 0
  B        = []
  while (addI < 9){
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        BRow.push(R[addI + i][addJ + j])
      }
    }
    B.push(BRow)
    BRow = []
    if (addJ == 6){
      addJ = 0
      if (addI == 6){
        addI = 10 // while loop exit condition
      } else {
        addI += 3
      }
    } else {
      addJ += 3
    }
  }
}

// Combining the generation of C, R and B arrays into a single call
function generateCheckArrays(){
  R = board
  generateC()
  generateB()
}

// Check equality of two arrays
function isArrEqual(arr1, arr2){
  let equality = true
  if (arr1.length !== arr2.length){
    equality = false
  } else {
    for (let i in arr1){
      if (arr2.indexOf(arr1[i]) == -1){
        equality = false
        break
      }
    }
  }
  return equality
}

// Check equality of previous set of options and current set of options to identify start of infinite loop in solving the puzzle
function isEqual(){
  let equality = true
  if (!Object.keys(prevOpts).length){
    equality = false
  } else {
    for (let pkey in prevOpts){
      // console.log(`pkey is ${pkey}`)
      if (pkey in opts){
        if (!isArrEqual(prevOpts[pkey], opts[pkey])){
          equality = false
          break
        }
      } else {
        equality = false
        break
      }
    }
  }

  if (equality){ loopCount += 1 }
  // console.log(prevOpts)
  // console.log(opts)
  // console.log(loop)
  // console.log(equality)
  return equality
}

// Generate opts object
function generateOpts(){
  generateCheckArrays()
  prevOpts = opts
  opts = {}
  for(let i = 0; i < 9; i++){
    for(let j = 0; j < 9; j++){
      if (!board[i][j]){
        opts[`${i}${j}`]=[]
      }
    }
  }
  // Populate the options object
  let idxB = 0
  for(let x in opts){
    if (((x[0] >= 0) && (x[0] <= 2)) && ((x[1] >= 0) && (x[1] <= 2))){ idxB = 0 }
    if (((x[0] >= 0) && (x[0] <= 2)) && ((x[1] >= 3) && (x[1] <= 5))){ idxB = 1 }
    if (((x[0] >= 0) && (x[0] <= 2)) && ((x[1] >= 6) && (x[1] <= 8))){ idxB = 2 }
    if (((x[0] >= 3) && (x[0] <= 5)) && ((x[1] >= 0) && (x[1] <= 2))){ idxB = 3 }
    if (((x[0] >= 3) && (x[0] <= 5)) && ((x[1] >= 3) && (x[1] <= 5))){ idxB = 4 }
    if (((x[0] >= 3) && (x[0] <= 5)) && ((x[1] >= 6) && (x[1] <= 8))){ idxB = 5 }
    if (((x[0] >= 6) && (x[0] <= 8)) && ((x[1] >= 0) && (x[1] <= 2))){ idxB = 6 }
    if (((x[0] >= 6) && (x[0] <= 8)) && ((x[1] >= 3) && (x[1] <= 5))){ idxB = 7 }
    if (((x[0] >= 6) && (x[0] <= 8)) && ((x[1] >= 6) && (x[1] <= 8))){ idxB = 8 }
    for(let i = 1; i <= 9; i++){
      if((R[x[0]].indexOf(i) == -1) && (C[x[1]].indexOf(i) == -1) && (B[idxB].indexOf(i) == -1)){
        opts[x].push(i)
      }
    }
  }

  // If the options array for any position has only a single value, fill in that value on the board
  for(let x in opts){
    if(opts[x].length == 1){
      board[x[0]][x[1]] = opts[x][0]
    }
  }
  // console.log(`opts Object`)
  // console.log(opts)
  // console.log(board)
}

// solve the sudoku
function solveSudoku(){
  // update options object for all positions on board having 0.
  generateOpts()

  // For every block on the board, run thru the options for the empty positions and see if any values can be further added to the board.
  // from the options for a block, a value can be added if it occurs just once among all the options.

  // for block-1: 0,0 thru 2,2
  // for block-2: 0,3 thru 2,5
  // for block-3: 0,6 thru 2,8
  // for block-4: 3,0 thru 5,2
  // for block-5: 3,3 thru 5,5
  // for block-6: 3,6 thru 5,8
  // for block-7: 6,0 thru 8,2
  // for block-8: 6,3 thru 8,5
  // for block-9: 6,6 thru 8,8
  let blkOpts = {},
  blkX    = 0,
  blkY    = 0
  while(blkX < 9){
    blkOpts = {}
    for(let x = 0 + blkX; x < 3 + blkX; x++){
      for(let y = 0 + blkY; y < 3 + blkY; y++){
        if (`${x}${y}` in opts){
          for(let i in opts[`${x}${y}`]){
            if (opts[`${x}${y}`][i] in blkOpts){
              blkOpts[opts[`${x}${y}`][i]].push(`${x}${y}`)
            } else {
              blkOpts[opts[`${x}${y}`][i]] = [`${x}${y}`]
            }
          }
        }
      }
    }

    for(let x in blkOpts){
      if(blkOpts[x].length == 1){
        let i = blkOpts[x][0][0],
        j = blkOpts[x][0][1]
        board[i][j] = Number(x)
      }
    }

    if(blkY == 6){
      blkY = 0
      if(blkX == 6){
        blkX = 10
      } else {
        blkX += 3
      }
    } else {
      blkY += 3
    }
  }

  // console.log(`After Block checking`)
  // console.log(board)
  // update options object for all positions on board having 0.
  // after each update to the board generate the opts object and R, C, B arrays
  generateOpts()

  // check thru options for every row to see if any option occurs just once in that row and add it to the board
  let rowOpts = {}
  for(let row = 0; row < 9; row++){
    rowOpts = {}
    for(let key in opts){
      if (key[0] == row){
        for (let idx in opts[key]){
          if (opts[key][idx] in rowOpts){
            rowOpts[opts[key][idx]].push(key)
          } else {
            rowOpts[opts[key][idx]] = [key]
          }
        }
      }
    }

    for(let x in rowOpts){
      if(rowOpts[x].length == 1){
        let i = rowOpts[x][0][0],
        j = rowOpts[x][0][1]
        board[i][j] = Number(x)
      }
    }
  }

  // console.log(`After Row checking`)
  // console.log(board)
  generateOpts()

  // check thru options for every column to see if any option occurs just once in that row and add it to the board
  let colOpts = {}
  for(let col = 0; col < 9; col++){
    colOpts = {}
    for(let key in opts){
      if (key[1] == col){
        for (let idx in opts[key]){
          if (opts[key][idx] in colOpts){
            colOpts[opts[key][idx]].push(key)
          } else {
            colOpts[opts[key][idx]] = [key]
          }
        }
      }
    }

    for(let x in colOpts){
      if(colOpts[x].length == 1){
        let i = colOpts[x][0][0],
        j = colOpts[x][0][1]
        board[i][j] = Number(x)
      }
    }
  }
  // console.log(`After Col checking`)
  // console.log(board)
  generateOpts()
}

// -------------------------------------------------------------------------------------------
// Actual Processing starts after this
// -------------------------------------------------------------------------------------------
// validations
if (!input){
  console.log(`Invalid Input`)
} else if (input.length !== 81){
  console.log(`Invalid Input. Not enough numbers`)
} else if (input.split('').reduce((a, i)=>{return a += (isNaN(i)? 1 : 0)},0)){
  console.log(`Invalid Input. Non Numeric values`)
} else {
  populateSudoku(input, board)
  // Now repeatedly call the solveSudoku function till the end
  console.log(`### Puzzle ###`)
  console.log(`--------------`)
  console.log(board)
  console.log()
  let end = false,
      pass= 1,
      text= `### Solution ###`
  while(!end){
    console.log(`--> Pass - ${pass}`)

    solveSudoku()

    if (!Object.keys(opts).length){
      end = true
    } else if (isEqual()){
      if (loopCount == 3){
        text = `### Partial Solution ### (starts to loop after ${pass - 2} pass(es))`
        end = true
      } else {
        pass++
      }
    } else {
      pass++
      loopCount = 0
    }
  }
  console.log()
  console.log(`${text}`)
  console.log(`----------------`)
  console.log(board)
}

// e.g., 085000700900073000030860000090000001008721600300000080000042010000910008007000920 - 6 passes to complete
// e.g., 000070010000065800006000730003010025000802000720090600064000200008430000090080000 - 4 passes to complete
// e.g., 000500000620700000049001020004090000901603205000070800070200950000007013000008000 - 4 passes to complete
// e.g., 000400200060010070000002014002060001309050608500090400950100000020080060001009000 - 7 passes to complete
// e.g., 008000160000010020000083400006020053000405000150090800004760000090040000087000500 - 4 passes to complete
// e.g., 005280000000004100009000403900700060080010040050009001406000200007400000000025600 - partial soln. Loops after 3 passes
// e.g., 400065007170000090000004080002030009000401000600090300090100000010000038200580001 - partial soln. Loops after 3 passes
// e.g., 000078020000320001009000380600000010001982500030000002014000900300096000060150000 - 6 passes to complete
// e.g., 902000008000085009400200000050006300010030020006400090000002003500810000600000702 - partial soln. Loops after 3 passes
// e.g., 000034000402000310000100500800600030200010009030007002003006000074000608000890000 - partial soln. Loops after 4 passes
