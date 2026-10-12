@extends('layouts.app')

@section('content')
<div class="row">
    <div class="col-md-3">
        <div class="panel panel-default" style="border: 2px solid #ccc;">
            <div class="panel-heading" style="background: #e0e0e0; font-weight: bold;">Navigation</div>
            <div class="panel-body" style="padding: 10px;">
                <ul class="list-unstyled">
                    <li><a href="/dashboard">Overview</a></li>
                    <li><a href="/records">Records Grid</a></li>
                    <li><a href="/audit">Audit Logs</a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="col-md-9">
        <div class="panel panel-primary">
            <div class="panel-heading">Operational Records Management</div>
            <div class="panel-body">
                <form method="POST" action="/records/update" class="form-horizontal">
                    @csrf
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Record Title:</label>
                        <div class="col-sm-10">
                            <input type="text" name="title" class="form-control" value="Batch #2026-A">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">Status:</label>
                        <div class="col-sm-10">
                            <select name="status" class="form-control">
                                <option value="PENDING">PENDING</option>
                                <option value="ACTIVE" selected>ACTIVE</option>
                                <option value="ARCHIVED">ARCHIVED</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="submit" class="btn btn-primary" style="padding: 7px 18px;">Update Record</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
