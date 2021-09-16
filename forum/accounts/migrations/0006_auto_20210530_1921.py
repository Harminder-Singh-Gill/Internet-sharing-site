# Generated by Django 3.1.7 on 2021-05-30 13:51

import accounts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_auto_20210530_1633'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_pic',
            field=models.ImageField(default='image.png', upload_to=accounts.models.get_image_upload_path),
        ),
    ]
