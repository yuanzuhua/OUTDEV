﻿var Products = [];
var index = 0;
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

//Array.prototype.remove = function () {
//    var what, a = arguments, L = a.length, ax;
//    while (L && this.length) {
//        what = a[--L];
//        while ((ax = this.indexOf(what)) !== -1) {
//            this.splice(ax, 1);
//        }
//    }
//    return this;
//};



function RemoveItem(el) {
    Dialog.ConfirmCustom("Xác nhận",
        "Bạn có chắc xóa sản phẩm này?",
        function () {
            var elm = $(el).closest('tr');
            var id = elm.data('id');
            elm.remove();
            for (var i = 0; i < Products.length - 1; i++) {
                if (Products[i].ID === id)
                    removeA(Products, Products[i]);
            }
        });
}
var Input = function () {
    var base = this;
    this.$table = $("#table");
    this.ResetForm = function (form) {

        if (form.length) {
            form.find("input, textarea, select")
                .each(function (index) {
                    var input = $(this);
                    if (input.is(":radio, :checkbox")) {
                        input.prop("checked", this.defaultChecked);
                    } else if (input.is("select")) {
                        input.val("-1");
                    } else {
                        input.val("");
                    }


                });
        }


    };

    this.Save = function () {

        if ($("#FrmOrder").valid()) {
            if (Products.length == 0) {
                alert("Vui lòng nhập sản phẩm");
                return;
            }
            if ($("#SrcStoreId").val() == $("#DesStoreId").val()) {
                alert("Kho nguồn phải khác kho đích");
                return;
            }
            //Check số lượng tồn



            Dialog.ConfirmCustom("Xác nhận", "Bạn có chắc chắn chuyển kho đơn hàng này?", function () {
                var order = {};
                order.SoPhieu = $("#SoPhieu").val();
                order.NgayNhapHD = $("input[name=NgayNhapHD]").val();
                order.SrcStoreId = $("#SrcStoreId").val();
                order.StoreId = $("#DesStoreId").val();

                Sv.AjaxPost({
                    Url: "/StoreTransfer/Add",
                    Data: { order: order, orderdetails: Products }
                },
                   function (rs) {
                       console.log(rs);
                       if (rs.ResponseCode === "01") {
                           Dialog.Alert(rs.Message, Dialog.Success, function () {
                               location.href = "index";
                           });

                           //base.LoadTableSearch();
                       } else {
                           Dialog.Alert(rs.Message, Dialog.Error);
                       }
                   });
            })
        }
        return;
    };


    this.ChangeProduct = function () {
        $("#ProductCode").val("");
        $("#NhaCC").val("");
        $("#NhomDv").val("");
        $("#Unit").val("");
        $("#DonGia").val("");
        var id = $("#Product").val() != "" ? $("#Product").val() : "-1";
        Sv.AjaxPost({
            Url: "/StoreInput/GetProductInfo",
            Data: { ProductId: id }
        },
            function (rs) {
                if (rs) {
                    $("#ProductCode").val(rs.Code);
                    $("#NhaCC").val(rs.SupplierID);
                    $("#NhomDv").val(rs.ProductCateID);
                    $("#Unit").val(rs.UnitID);
                    $("#DonGia").val(rs.PriceOrder);
                } else {

                }
            });
    };
    this.AddProduct = function () {
        if ($("#formProduct").valid()) {
            index++;
            var obj = {};
            obj.ID = index;
            obj.ProductId = $("#Product").val();
            obj.ProductCode = $("#ProductCode").val();
            obj.CateId = $("#NhomDv").val();
            obj.Price = $("#DonGia").val();
            obj.SupplierId = $("#NhaCC").val();
            obj.Quantity = $("#SoLuongNhap").val();
            obj.UnitId = $("#Unit").val();
            obj.NgaySanXuat = "";
            obj.HanSuDung = "";
            obj.ProductName = $("#Product :selected").text();
            obj.CateName = $("#NhomDv :selected").text();

            Products.push(obj);
            var newRowContent =
                "<tr data-id='" + index + "'> <td> " +
                    $("#Product :selected").text() +
                    " </td> <td> " +
                    $("#ProductCode").val() +
                    "</td> <td> " +
                    $("#NhaCC :selected").text() +
                    " </td> <td> " +
                    $("#NhomDv :selected").text() +
                    " </td>  <td> " +
                    //$("input[name=NgaySanXuat]").val() +
                    //" </td> <td> " +
                    //$("input[name=HanSuDung]").val() +
                    //"  </td> <td> " +
                    $("#SoLuongNhap").val() +
                    " </td> <td>" +
                    $("#Unit :selected").text() +
                    " </td> <td> " +
                    $("#DonGia").val() +
                    "  </td>" +
                  //  "<td><i class='fa fa-times' onclick='RemoveItem(this)' aria-hidden='true'></i></td>" +
                    " </tr>";
            $("#product-table tbody").append(newRowContent);
            base.ResetForm($("#formProduct"));
        }

    };
};
$(document)
    .ready(function () {
        var unit = new Input();
        Sv.AjaxPost({
            Url: "/StoreTransfer/GetTransferCode"
        },
         function (rs) {
             $("#SoPhieu").val(rs);
         });

        $("#Product")
            .change(function () {
                unit.ChangeProduct();
            });
        $("#btnOk")
            .click(function () {
                unit.AddProduct();
            });
        $("#btnSave").click(function () {
            unit.Save();
        });
    });