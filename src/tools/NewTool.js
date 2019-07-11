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
        // location.pathname.split('/')[1]
        // 新建一个窗口，
        // window.open(`/${location.pathname.split('/')[1]}/ureport/designer`);
        
        // 目前新建按钮仅在designer页面存在，所以采用相对路径即可。
        window.open('./designer');
    }
    getTitle(){
        return `新建`;
    }
    getIcon(){
        return `<i style="color: #0e90d2;font-style:normal">新建</i>`;
    }
}