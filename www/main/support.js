define([],function(){
    return {
        documentWidth : document.body.clientWidth,
        gridContainerWidth : 0.92 * document.body.clientWidth,
        cellSideLength : 0.92 * 0.2 * document.body.clientWidth,
        cellSpace : 0.92 * 0.04 * document.body.clientWidth,

        getPosTop : function( i , j ){
            return this.cellSpace + i * (this.cellSideLength + this.cellSpace);
        },

        getPosLeft: function( i , j ){
            return this.cellSpace + j * (this.cellSideLength + this.cellSpace);
        },

        getNumberBackgroundColor : function ( number ){
            switch( number ){
                case 2:return "#eee4da";break;
                case 4:return "#ede0c8";break;
                case 8:return "#f2b179";break;
                case 16:return "#f59563";break;
                case 32:return "#f67c5f";break;
                case 64:return "#f65e3b";break;
                case 128:return "#edcf72";break;
                case 256:return "#edcc61";break;
                case 512:return "#9c0";break;
                case 1024:return "#33b5e5";break;
                case 2048:return "#09c";break;
                case 4096:return "#a6c";break;
                case 8192:return "#93c";break;
            }

            return "black";
        },

        getNumberColor : function( number ){
            if( number <= 4 )
                return "#776e65";

            return "white";
        },


        nospace : function (board){

            for( var i = 0 ; i < 4 ; i ++ )
                for( var j = 0 ; j < 4 ; j ++ )
                    if( board[i][j] == 0 )
                        return false;

            return true;
        },

        canMoveLeft : function (board){
            for(var i = 0; i < 4; i++)
                for(var j = 1; j < 4; j++){
                    if(board[i][j] != 0)
                        if(board[i][j - 1] == 0 || board[i][j - 1] == board[i][j])
                            return true;
                }
            return false;
        },

        canMoveRight : function (board){
            for(var i = 0; i < 4; i++)
                for(var j = 2; j >= 0; j--){
                    if(board[i][j] != 0)
                        if(board[i][j + 1] == 0 || board[i][j + 1] == board[i][j])
                            return true;
                }
            return false;
        },

        canMoveUp : function (board){
            for(var j = 0; j < 4; j++)
                for(var i = 1; i < 4; i++){
                    if(board[i][j] != 0)
                        if(board[i - 1][j] == 0 || board[i - 1][j] == board[i][j])
                            return true;
                }
            return false;
        },

        canMoveDowm : function (board){
            for(var j = 0; j < 4; j++)
                for(var i = 2; i >= 0; i--){
                    if(board[i][j] != 0)
                        if(board[i + 1][j] == 0 || board[i + 1][j] == board[i][j])
                            return true;
                }
            return false;
        },


        noBlockHorizontal : function (row, col1, col2, _board){
            for (var col = col1 + 1; col < col2; col++) {
                if(_board[row][col] != 0)
                    return false;
            }
            return true;
        },

        noBlockVertical : function (col, row1, row2, _board){
            for (var row = row1 + 1; row < row2; row++) {
                if(_board[row][col] != 0)
                    return false;
            }
            return true;
        },
        nomove : function (_board){
            if(this.canMoveLeft(_board) ||
                this.canMoveRight(_board) ||
                this.canMoveUp(_board) ||
                this.canMoveDowm(_board))
                return false;
            return true;
        }


    };
});


   










