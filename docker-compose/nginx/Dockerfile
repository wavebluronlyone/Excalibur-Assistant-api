FROM nginx:1.15.6
COPY nginx.conf /etc/nginx/nginx.conf
COPY bebebee.be.conf /etc/nginx/sites-available/bebebee.be.conf
COPY general.conf /etc/nginx/nginxconfig.io/general.conf
COPY letsencrypt.conf /etc/nginx/nginxconfig.io/letsencrypt.conf
COPY proxy.conf /etc/nginx/nginxconfig.io/proxy.conf


# HTTPS: certbot (obtain certificates)
# disable before first run: ssl_certificate, ssl_certificate_key, ssl_trusted_certificate
# RUN certbot certonly --webroot -d bebebee.be -d www.bebebee.be --email info@bebebee.be -w /var/www/_letsencrypt -n --agree-tos --force-renewal
