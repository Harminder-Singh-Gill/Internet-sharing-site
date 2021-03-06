# Generated by Django 3.1.7 on 2021-05-09 09:46

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20210415_1247'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='description',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='user',
            name='followers',
            field=models.ManyToManyField(related_name='followed_users', to=settings.AUTH_USER_MODEL),
        ),
    ]
