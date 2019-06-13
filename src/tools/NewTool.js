/**
 * Created by oy on 2019-06-12.
 */
import Tool from './Tool.js';
// import OpenDialog from '../dialog/OpenDialog.js';

export default class OpenTool extends Tool{
    constructor(context){
        super(context);
        // this.openDialog=new OpenDialog(context);
    }
    execute(){
        // this.openDialog.show()
        // 新建一个窗口
        window.open('/ureportwar/ureport/designer');
    }
    getTitle(){
        return `新建`;
    }
    getIcon(){
        return `<i style="color: #0e90d2;font-style:normal">新建</i>`;
    }
}