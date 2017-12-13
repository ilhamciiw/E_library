<!DOCTYPE html>
<html>
<head>
	<title>Login</title>
	<!-- <script src="<?php echo base_url() ?>assets/js/query.js"></script>
	<script src="<?php echo base_url() ?>assets/js/popper.js"></script>
	<link rel="stylesheet" href="<?php echo base_url() ?>assets/css/bootstrap.css"> -->
	<!-- <script src="<?php echo base_url() ?>assets/js/bootstrap.js"></script> -->
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
<body style="background-color: ">
        <div id="navwrap1">
            <div id="navwrap2">

                <div class="navbar navbar-inverse navbar-static-top" role="navigation">
                    <div id="nav-tophat-helper" class="hidden-xs" style="color:blue;"></div>
                    <ul class="nav navbar-nav navbar-main">
                        

                        <li class="navbar-brand-li">
                            <a class="navbar-brand" href="index.html" target="_top"><img src="<?php echo base_url(); ?>assets/images/logo-alarm12.png" alt="logo yapi" style="width:100x;height:100px;"></a>
                        </li>

                        <div class="row">
						<div class="col-4">
			
						</div>
						<div class="col-4">
							<h1>Perpustakaan Online SMP 12 Al-Azhar Rawamangun</h1>
						<div class="col-4">
						</div>

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

                    </ul>

					
                    
                </div>
                <!--/.navbar-->

            </div>
            <!--#navwrap1-->
        </div>
<div class="container">
	<div class="row">
		
		<center><div class="col" style="margin-top: 100px;margin-right: 50px">
			<div>
				<form action="<?php echo base_url('index.php/login/aksi_login'); ?>" method="post">		
					<div class="input-group">
				  		<input type="text" class="form-control" name="username" placeholder="Username" aria-describedby="basic-addon1">
					</div>
					<br>
					<div class="input-group">
				  		<input type="password" class="form-control" name="password" placeholder="Password" aria-describedby="basic-addon1">
					</div>
					<br>
					<button class="btn btn-primary" type="submit">Login</button> 
				</form>
			</div>
		</center>

		<div class="col-4">
			
		</div>
	</div>
</div>
</body>
</html>