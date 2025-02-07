<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <title>Active Incidents | Hamilton County 9-1-1 Emergency Communications District</title>
    <meta name="Description"
        content="Active incidents are dispatched from the Hamilton County 9-1-1 Center. Contents are updated regularly from the Computer Aided Dispatch system." />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
        integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
        crossorigin="" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.fullscreen@latest/Control.FullScreen.css" type="text/css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@latest/dist/MarkerCluster.css"
        type="text/css" />
    <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
        integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
        crossorigin=""></script>
    <script type="text/javascript" src="https://unpkg.com/leaflet.fullscreen@latest/Control.FullScreen.js"></script>
    <script type="text/javascript" src="https://unpkg.com/leaflet.markercluster@latest/dist/leaflet.markercluster.js">
    </script>
    <script type="text/javascript" src="https://hc911.org/js/kennetic-popup.js"></script>




    <?php include "includes/header-code.php"; ?>
</head>
<body>
    <div id="page" class="site page-active-incidents">
        <header id="masthead" class="site-header clearfix" role="banner">
            <?php include "includes/appbar-map.php"; ?>
        </header>
    </div>
    <div id="page" class="site page-active-incidents">
        
        <div id="ENSLoadOut">
            <script>const clientID = "9c44f764-fbf7-424c-820b-b954a7899acd";</script>
            <script src="https://ensloadout.911emergensee.com/ensloadout.js"></script>
        </div>

        <footer id="colophone" class="site-footer clearfix" role="contentinfo">
            <?php include "includes/footer.php"; ?>
        </footer>
        <!-- /#colophone -->

        <?php include "includes/quick-links.php"; ?>
        <?php include "includes/alert.php"; ?>
    </div>
    <!-- /#page -->

    <?php include "includes/footer-code.php"; ?>
    
</body>
<!-- <script src=https://static.elfsight.com/platform/platform.js data-use-service-core defer></script> -->
</html>

