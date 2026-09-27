using Microsoft.EntityFrameworkCore;
using Ministore.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. إضافة الخدمات (Controllers & OpenApi)
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// 2. إعداد سياسة CORS للربط مع Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 3. تسجيل DbContext وقراءة Connection String لـ PostgreSQL
builder.Services.AddDbContext<MinistoreDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// 4. إعداد الـ Request Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// 5. تفعيل سياسة CORS (يجب أن تكون قبل UseHttpsRedirection و Authorization)
app.UseCors("AllowAngular");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();
app.MapControllers();

app.Run();