/**
 * Created by Jacky.Gao on 2017-02-12.
 */
import {formatDate,resetDirty} from '../Utils.js';
import {alert,confirm} from '../MsgBox.js';

export default class SaveDialog{
    constructor(){
        this.reportFilesData={};
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

        const paramRow=$(`<div class="row" style="margin: 10px;"><span class="row-label">Param</span></div>`);
        this.paramEditor=$(`<input type="text" placeholder="root/..." value="root"  class="form-control"  >`);
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

        this.jftypeEditor.change(function (evt) {
            let val = $(this).val();
            if(val == 'json'){
                _this.jsonEditor.show();
                _this.formEditor.hide();
            }else if(val == 'form'){
                _this.jsonEditor.hide();
                _this.formEditor.show();
            }
        })

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
    }

    initFooter(footer){
        const _this=this;
        const skipButton = $(`<button type="button" class="btn">跳过</button>`)
        footer.append(skipButton);
        skipButton.click(function () {
            _this.dialog.modal('hide');
            _this.callback();
        });

        const saveButton=$(`<button type="button" class="btn btn-primary">${window.i18n.dialog.save.save}</button>`);
        footer.append(saveButton);
        saveButton.click(function(){
            let name =_this.nameEditor.val();
            let url =_this.urlEditor.val();
            let param =_this.paramEditor.val();
            let method =_this.methodEditor.val();
            let headers = form2Json(_this.headerEditor);
            let jftype =_this.jftypeEditor.val();
            let jf =_this.jsonEditor.val();

            if(!(name && url)){
                alert('请填写name、url')
                return;
            }

            try {
                jf = jf && JSON.parse(jf);
                if(jftype == 'form'){
                    jf = form2Json(_this.formEditor);
                }
            } catch (error) {
                alert('内容JSON格式错误')
            }

            _this.context.__$__oy = {
                name,
                url,
                param,
                method,
                headers,
                jftype,
                jf
            }
            console.log("_this.context.__$__oy)", _this.context.__$__oy);
            _this.dialog.modal('hide');
            _this.callback();
        });

        function form2Json(form){
            const keys = $(form).find('input[placeholder="key"]');
            const values = $(form).find('input[placeholder="value"]');
            let json = {};
            keys.each((idx, item) => {
                let key = $(item).val();
                let value = $(values[idx]).val();
                if(key && value){
                    json[key] = value;
                }
            });
            // 若json内无数据，则返回''
            if(Object.keys(json).length == 0){
                json = ''
            }
            return json;
        }
    }

    show(context, callback){
        // const _this=this;
        this.context=context;
        this.callback = callback;
        // this.fileEditor.val('');
        // this.providerSelect.empty();
        // this.fileTableBody.empty();
        // this.reportFilesData={};
        this.dialog.modal('show');
    }
}