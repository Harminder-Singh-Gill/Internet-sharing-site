# Generated by Django 3.1.7 on 2021-04-12 14:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='post_type',
            field=models.CharField(default='text', max_length=5),
        ),
    ]