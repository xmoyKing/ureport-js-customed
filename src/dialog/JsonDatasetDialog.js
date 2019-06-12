/**
 * Created by Jacky.Gao on 2017-02-12.
 */
import {formatDate,resetDirty} from '../Utils.js';
import {alert,confirm} from '../MsgBox.js';


function form2JsonArr(form){
    const keys = $(form).find('input[placeholder="key"]');
    const values = $(form).find('input[placeholder="value"]');
    let arr = [];
    // jquery中的each和js原生forEach有差别
    keys.each((idx, item) => {
        let name = $(item).val();
        let value = $(values[idx]).val();
        // 当name存在时才加入
        if(name){
            arr.push({ name, value });
        }
    });
    return arr;
}


function jsonArr2form(jsonArr, form){
    // 清空所有input，需要创建新的input输入框
    $(form).find('.btn-danger').click();
    for(let idx = 0; idx < jsonArr.length; idx++){
        $(form).find('.btn-primary').click();
    }
    // 重新填入新的input值
    let keys = $(form).find('input[placeholder="key"]');
    let values = $(form).find('input[placeholder="value"]');
    jsonArr.forEach((item, idx) => {
        $(keys[idx]).val(item.name);
        $(values[idx]).val(item.value);
    });
}

export default class JsonDatasetDialog{
    constructor(datasource){
        this.datasource = datasource;
        this.dialog=$(`<div class="modal fade" role="dialog" aria-hidden="true" style="z-index: 10000">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                            &times;
                        </button>
                        <h4 class="modal-title">
                            Json格式-数据源 Dateset 配置
                        </h4>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>`);
        const body=this.dialog.find('.modal-body'),footer=this.dialog.find(".modal-footer");
        this.initBody(body);
        this.initFooter(footer);
    }
    initBody(body){
        let _this = this; // 用于function内
        const style = $(`<style>
        .row-label { 
            min-width: 70px;
            display: inline-block;
        } 
        .row-label+.form-control {
            font-size: 13px;
            width: 300px;
            display: inline-block;
        }
        form input.form-control {
            width: 100px;
            display: inline-block;
        }
        .row-label+form.form-control,
        .row-label+textarea.form-control {
            height: auto;
            width: 500px;
            display: block;
            margin-left: 70px;
        }
        
        </style>`);
        body.append(style);

        const nameRow=$(`<div class="row" style="margin: 10px;"><span class="row-label">Name*</span></div>`);
        this.nameEditor=$(`<input type="text" class="form-control" >`);
        nameRow.append(this.nameEditor);
        body.append(nameRow);

        const urlRow=$(`<div class="row" style="margin: 10px;"><span class="row-label">URL*</span></div>`);
        this.urlEditor=$(`<input type="text" class="form-control" >`);
        urlRow.append(this.urlEditor);
        body.append(urlRow);

        const paramRow=$(`<div class="row" style="margin: 10px;"><span class="row-label">Parameter</span></div>`);
        this.paramEditor=$(`<input type="text" value="root"  class="form-control"  >`);
        paramRow.append(this.paramEditor);
        body.append(paramRow);

        const methodRow=$(`<div class="row" style="margin: 10px;"><span class="row-label">Method*</span></div>`);
        this.methodEditor=$(`
        <select class="form-control" value="get">
          <option value="get">get</option>
          <option value="post">post</option>
        <select>`);
        methodRow.append(this.methodEditor);
        body.append(methodRow);


        const headerRow=$(`<div class="row" style="margin:10px;"><span class="row-label">Headers</span></div>`);
        this.headerEditor=$(`
            <form class="form-control">
                <button type="button" class="btn btn-primary">+</button>
                <div>
                    <input type="text" class="form-control" placeholder="key">
                    :<input type="text" class="form-control" placeholder="value">

                    <button type="button" class="btn btn-danger">-</button>
                </div>
            </form>`);
        headerRow.append(this.headerEditor);
        body.append(headerRow);
        // 操作key-value
        this.headerEditor.on('click', '.btn-primary', function () {
            $(this).parent().append(`
            <div>
                <input type="text" class="form-control" placeholder="key">
                :<input type="text" class="form-control" placeholder="value">

                <button type="button" class="btn btn-danger">-</button>
            </div>`)
        }).on('click', '.btn-danger', function () {
            $(this).parent().remove();
        });

        const jftypeRow=$(`<div class="row" style="margin: 10px;"><span class="row-label">格式</span></div>`);
        this.jftypeEditor=$(`
        <select class="form-control" value="json">
            <option value="json">json</option>
            <option value="form">form</option>
        <select>`);
        jftypeRow.append(this.jftypeEditor);
        body.append(jftypeRow);

        const jsonRow=$(`<div class="row" style="margin:10px;"><span class="row-label">JSON内容</span></div>`);
        this.jsonEditor=$(`<textarea placeholder="{key: value1, key2: value2}" class="form-control" rows="8" cols="30" style="width: 660px"></textarea>`);
        jsonRow.append(this.jsonEditor);
        body.append(jsonRow);

        const formRow=$(`<div class="row" style="margin:10px;" hidden><span class="row-label">Form内容</span></div>`);
        this.formEditor=$(`
            <form class="form-control">
                <button type="button" class="btn btn-primary">+</button>
                <div>
                    <input type="text" class="form-control" placeholder="key">
                    :<input type="text" class="form-control" placeholder="value">

                    <button type="button" class="btn btn-danger">-</button>
                </div>
            </form>`);
        formRow.append(this.formEditor);
        body.append(formRow);
        // 操作key-value
        this.formEditor.on('click', '.btn-primary', function () {
            $(this).parent().append(`
            <div>
                <input type="text" class="form-control" placeholder="key">
                :<input type="text" class="form-control" placeholder="value">

                <button type="button" class="btn btn-danger">-</button>
            </div>`)
        }).on('click', '.btn-danger', function () {
            $(this).parent().remove();
        });

        // json/form切换 select
        this.jftypeEditor.change(function (evt) {
            let val = $(this).val();
            if(val == 'json'){
                jsonRow.show();
                formRow.hide();
            }else if(val == 'form'){
                jsonRow.hide();
                formRow.show();
            }
        })
    }

    initFooter(footer){
        const _this=this;

        const saveButton=$(`<button type="button" class="btn btn-primary">${window.i18n.dialog.save.save}</button>`);
        footer.append(saveButton);
        saveButton.click(function(){
            let name =_this.nameEditor.val();
            let url =_this.urlEditor.val();
            let parameter =_this.paramEditor.val();
            let method =_this.methodEditor.val();
            let headers = form2JsonArr(_this.headerEditor);
            let type =_this.jftypeEditor.val();
            let json =_this.jsonEditor.val();
            let params = form2JsonArr(_this.formEditor);

            if(!(name && url)){
                alert('请填写name、url')
                return;
            }

            _this.dataset = {
                name,
                url,
                parameter,
                method,
                body: {
                    type,
                }
            }
            // 若没有headers则，dataset中不设置headers
            if(headers.length){
                // 由于xml中headers嵌套了双层，所以此处为了统一而嵌套
                // 根本原因在于xml转换时会将xml标签内容解析为复数的形式
                _this.dataset.headers = { headers }
            }

            if(type == 'json' && json){
                try { // 校验json格式
                    JSON.parse(json);
                } catch (error) {
                    alert('内容JSON格式错误')
                }
                _this.dataset.body.json = json;
            } else if(type == 'form' && params.length){
                _this.dataset.body.params = params;
            } else {
                // 若json和params都没有，则删除body
                delete _this.dataset.body;
            }


            console.log("_this.dataset:", _this.dataset);
            _this.dialog.modal('hide');
            _this.callback(_this.dataset);
        });
    }

    show(callback, dataset){
        const _this=this;
        this.callback = callback;
        this.dataset = dataset;
        if(dataset){
            console.log('传入的dataset', dataset);

            _this.nameEditor.val(dataset.name);
            _this.urlEditor.val(dataset.url);
            _this.paramEditor.val(dataset.parameter);
            _this.methodEditor.val(dataset.method);
            if(dataset.headers){
                jsonArr2form(dataset.headers.headers, _this.headerEditor);
            }
            if(dataset.body){
                _this.jftypeEditor.val(dataset.body.type);
                // 解析body参数
                if(dataset.body.type == 'json'){
                    _this.jsonEditor.val(dataset.body.json);
                    _this.jsonEditor.parent().show();
                    _this.formEditor.parent().hide();
                }else if(dataset.body.type == 'form'){
                    jsonArr2form(dataset.body.params, _this.formEditor);
                    _this.formEditor.parent().show();
                    _this.jsonEditor.parent().hide();
                }
            }

        }
        this.dialog.modal('show');
    }
}