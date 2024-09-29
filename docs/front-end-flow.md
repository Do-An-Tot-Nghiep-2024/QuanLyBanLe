# Front end flow


- Định nghĩa schema để validate input sử dụng zod
- Call api ở service nếu response.message  == "success" thực hiện tiếp nếu không thì báo lỗi
```javascript
    const response = await api.getService();
    if(response.message === "success"){
        // thực hiện tiếp tục
    }
```
- Sử dụng React Query để thực hiện call api thông qua service

- Định nghĩa Type cho các props của component

- Viết các page theo quyền dưới route tương ứng của quyền đó

```javascript
 <Route
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                allowedRoles={["MANAGER"]}
                userRole={userRole}
                redirectPath="/login"
              />
            }
          >
            {/* viết giao diện các chức năng của quản lý dưới sidebar */}
            <Route element={<Sidebar />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employees" element={<EmployeePage />} />
        
            </Route>
          </Route>
```

Thay đổi file env backend url


