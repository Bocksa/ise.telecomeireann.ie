<%@ Page Title="Grade Sheet" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="ise.telecomeireann.ie.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="../Content/Default.css" rel="stylesheet"/>
    <script src="../Scripts/Default.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
<div class="form-wrapper">
    <div class="form-title">
        <h1>Grade Sheet</h1>
    </div>
    <div id="form-sections">
        <!-- Gets filled in by Default.js -->
    </div>
</div>
</asp:Content>