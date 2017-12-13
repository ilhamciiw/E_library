<!DOCTYPE html>
<html>
<head>
    <title>Upload buku</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>
        window.archive_setup = []
    </script>
    <script src="<?php echo base_url(); ?>assets/includes/jquery-1.10.2.min7a0c.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/analyticsefbc.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/bootstrap.minee7b.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/polyfill.minefbc.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/node_modules/react/dist/reacta5f5.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/node_modules/react-dom/dist/react-doma5f5.js" type="text/javascript"></script>
    <script src="<?php echo base_url(); ?>assets/includes/archive.minefbc.js" type="text/javascript"></script>
    <meta name="DESCRIPTION" content="Internet Archive is a non-profit digital library offering free universal access to books, movies & music, as well as 305 billion archived web pages." />
    <link rel="alternate" type="application/xml" title="RSS" href="services/collection-rss.php" />
    <script type="application/ld+json">
        {"@context":"http:\/\/schema.org","@type":"WebSite","name":"Internet Archive","alternateName":"Archive.org","url":"https:\/\/archive.org","potentialAction":{"@type":"SearchAction","target":"https:\/\/archive.org\/search.php?query={query}","query-input":"required name=query"}} </script>

    <link href="<?php echo base_url(); ?>assets/includes/archive.minefbc.css" rel="stylesheet" type="text/css" />
    <link rel="SHORTCUT ICON" href="<?php echo base_url(); ?>assets/images/glogo.jpg" />
</head>

<body class="navia top ia-module bgEEE lists showdetails">
    <a href="#maincontent" class="hidden-for-screen-readers">Skip to main content</a>

    <!-- Wraps all page content -->
    <div id="wrap">

        <div id="navwrap1">
            <div id="navwrap2">

                <div class="navbar navbar-inverse navbar-static-top" role="navigation">
                    <div id="nav-tophat-helper" class="hidden-xs" style="color:blue;"></div>
                    <ul class="nav navbar-nav navbar-main">
                        

                        <li class="navbar-brand-li">
                            <a class="navbar-brand" href="<?php echo base_url() ?>index.php/welcome" target="_top"><img src="<?php echo base_url(); ?>assets/images/yapi.png" alt="logo yapi" style="width:40x;height:40px;"></a>
                        </li>

                        <li class="nav-hamburger dropdown dropdown-ia pull-right hidden-sm hidden-md hidden-lg">
                            <div class="container-fluid">
                                <div class="navbar-header">
                                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-hamburger-menu" aria-expanded="false">
                                        <span class="sr-only">Toggle navigation</span>
                                        <span class="icon-bar"></span>
                                        <span class="icon-bar"></span>
                                        <span class="icon-bar"></span>
                                    </button>
                                    
                                    <!-- /.navbar-collapse -->
                                </div>
                            </div>
                            <!-- /.container-fluid -->
                        </li>

                    
                        <li class="dropdown dropdown-ia pull-right">
                            <div class="dropdown">
                                <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Upload
                                 <span class="caret"></span></button>
                                 <ul class="dropdown-menu">
                              <li><a href="<?php echo base_url() ?>index.php/crud_upload">Buku</a></li>
                                   <li><a href="<?php echo base_url() ?>index.php/crud_upload/video">Video</a></li>
                                    <li><a href="<?php echo base_url() ?>index.php/crud_upload/audio">Audio</a></li>
                                    <li><a href="<?php echo base_url() ?>index.php/crud_upload/foto">Foto</a></li>
                               </ul>
                              </div>
                            </li>

                        <li class="dropdown dropdown-ia pull-right">
                            <div class="dropdown">
                                <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Admin
                                 <span class="caret"></span></button>
                                 <ul class="dropdown-menu">
                                   <li><a href="<?php echo base_url() ?>index.php/admin/list_user">Data User</a></li>
                                   <li><a href="<?php echo base_url() ?>index.php/login/logout">Log Out</a></li>
                                    
                               </ul>
                              </div>
                        </li>

                    </ul>

					
                    
                </div>
                <!--/.navbar-->

            </div>
            <!--#navwrap1-->
        </div>
<div class="container">
	<div class="row">
		<center>
			<h3>Upload Buku</h3>
		</center>
	</div>
	<div class="row">
		<div class="col-4">
			
		</div>
		<div class="col-4">
				<form action="<?php echo base_url(). 'crud/tambah_aksi'; ?>" method="post">
					<table style="margin:20px auto;">
						
						<tr>
							<td>ID Buku</td>
							<td>
								<div class="input-group">
									<input class="form-control" type="text" name="id_buku" aria-describedby="basic-addon1">
								</div>
							</td>
						</tr>
						<tr>
							<td>Judul Buku</td>
							<td>
								<div class="input-group">
									<input class="form-control" type="text" name="judul_buku" aria-describedby="basic-addon1">
								</div>
							</td>
						</tr>
						<tr>
							<td>ISBN</td>
							<td>
								<div class="input-group">
									<input class="form-control" type="text" name="isbn" aria-describedby="basic-addon1">
								</div>
							</td>
						</tr>
						<tr>
							<td>Pengarang</td>
							<td>
								<div class="input-group">
									<input class="form-control" type="text" name="pengarang" aria-describedby="basic-addon1">
								</div>	
							</td>
						</tr>
						<tr>
							<td>Penerbit</td>
							<td>
								<div class="input-group">
									<input class="form-control" type="text" name="penerbit" aria-describedby="basic-addon1">
								</div>	
							</td>
						</tr>
						<tr>
							<td>Tahun</td>
							<td>
								<div class="input-group">
									<input class="form-control" type="text" name="tahun" aria-describedby="basic-addon1">
								</div>	
							</td>
						</tr>
						<tr>
							<td>File</td>
							<td>
								<div class="input-group">
									<input class="form-control" type="file" name="file" aria-describedby="basic-addon1">
								</div>	
							</td>
						</tr>
						<tr>
							<td></td>
							<td><input class="btn btn-secondary" type="submit" value="Upload"></td>
						</tr>
					</table>
				</form>	
		<div class="col-4">
			
		</div>
	</div>