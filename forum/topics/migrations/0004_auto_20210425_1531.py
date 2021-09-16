# Generated by Django 3.1.7 on 2021-04-25 10:01

from django.db import migrations, models
import topics.models


class Migration(migrations.Migration):

    dependencies = [
        ('topics', '0003_auto_20210425_1519'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='icon',
            field=models.ImageField(upload_to=topics.models.get_topic_icon_path),
        ),
    ]